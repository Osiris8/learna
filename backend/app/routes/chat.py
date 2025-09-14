# Chat routes will be implemented in task 4.1 and 4.
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions.database import db
from app.models.chat import Chat
from app.models.message import Message
from extensions.chroma import (
    get_collection, 
    add_message_to_collection, 
    delete_chat_collection,
    get_conversation_context
)


chat_bp = Blueprint("chats", __name__)

# First user prompt from dashboard

@chat_bp.route("/chat", methods=["POST"])
@jwt_required()
def create_chat():
    data = request.json
    user_id = get_jwt_identity()

    prompt = data.get("title")
    agent_type = data.get("agent", "assistant")
    model = data.get("model", "gpt-oss:20b")

    if not prompt:
        return jsonify({"error": "The title/prompt is required"}), 400
    
    chat = Chat(
        title=prompt,
        model=model,
        agent=agent_type,
        user_id=user_id
    )
    db.session.add(chat)
    db.session.commit()

    user_msg = Message(chat_id=chat.id, sender="user", content=prompt)
    db.session.add(user_msg)

   
    db.session.commit()
    
    # Add message to ChromaDB for semantic search
    add_message_to_collection(
        chat_id=chat.id,
        message_id=user_msg.id,
        content=prompt,
        sender="user",
        metadata={
            "model": model,
            "agent": agent_type
        }
    )


    return jsonify({
        "chat_id": chat.id,
        "title": chat.title,
      
        "created_at": chat.created_at,
        "agent": agent_type,
        "messages": [
            {"id": user_msg.id, "sender": user_msg.sender, "content": user_msg.content}
        ]
    }), 201



@chat_bp.route("/chat/<int:chat_id>", methods=["GET"])
@jwt_required()
def get_chat(chat_id):
    chat = Chat.query.get_or_404(chat_id)
    messages = Message.query.filter_by(chat_id=chat.id).all()
    return jsonify({
        "id": chat.id,
        "title": chat.title,
        "model": chat.model,
        "agent": chat.agent,
        "messages": [{"id": m.id, "sender": m.sender, "content": m.content} for m in messages]
    })

@chat_bp.route("/chat/<int:chat_id>", methods=["DELETE"])
@jwt_required()
def delete_chat(chat_id):
    chat = Chat.query.get_or_404(chat_id)


    Message.query.filter_by(chat_id=chat.id).delete()

    
    db.session.delete(chat)
    db.session.commit()

    # Delete ChromaDB collection
    try:
        delete_chat_collection(chat.id)
    except Exception as e:
        print(f"Warning: could not delete ChromaDB collection: {e}")

    return jsonify({"message": "Chat and its messages deleted"})


# Rename Chat(prompt) on dashboard sidebar

@chat_bp.route("/chat/<int:chat_id>", methods=["PUT"])
@jwt_required()
def update_chat(chat_id):
    user_id = get_jwt_identity()
    chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first_or_404()
    data = request.json
    new_title = data.get("title")
    if not new_title:
        return jsonify({"error": "Title is required"}), 400

    chat.title = new_title
    db.session.commit()
    return jsonify({"id": chat.id, "title": chat.title})


# Liste Chat(prompts) on dashboard sidebar
@chat_bp.route("/navbar-summaries", methods=["GET"])
@jwt_required()
def get_navbar_summaries():
    user_id = get_jwt_identity() 
    
    chats = Chat.query.filter_by(user_id=user_id).order_by(Chat.created_at.desc()).all()
    
    summaries = [
        {
            "id": chat.id,
            "title": chat.title
        }
        for chat in chats
    ]
    
    return jsonify(summaries)

# S
end message to existing chat with AI response
@chat_bp.route("/chat/<int:chat_id>/message", methods=["POST"])
@jwt_required()
def send_message(chat_id):
    """Send a message to an existing chat and get AI response."""
    user_id = get_jwt_identity()
    data = request.json
    
    message_content = data.get("content")
    enable_rag = data.get("enable_rag", True)
    
    if not message_content:
        return jsonify({"error": "Message content is required"}), 400
    
    # Verify chat belongs to user
    chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first_or_404()
    
    # Add user message to database
    user_message = Message(
        chat_id=chat_id,
        sender="user",
        content=message_content
    )
    db.session.add(user_message)
    db.session.commit()
    
    # Add user message to ChromaDB
    add_message_to_collection(
        chat_id=chat_id,
        message_id=user_message.id,
        content=message_content,
        sender="user"
    )
    
    # Get conversation context for RAG if enabled
    context_messages = []
    if enable_rag:
        context_messages = get_conversation_context(
            chat_id=chat_id,
            current_message=message_content,
            context_limit=5
        )
    
    # TODO: Generate AI response using the context
    # This will be implemented in task 5.2
    ai_response = f"I received your message: '{message_content}'. AI response generation will be implemented in the next task."
    
    if context_messages:
        ai_response += f"\n\nBased on our conversation context, I found {len(context_messages)} relevant previous messages."
    
    # Add AI response to database
    ai_message = Message(
        chat_id=chat_id,
        sender="assistant",
        content=ai_response,
        model_used=chat.model
    )
    db.session.add(ai_message)
    db.session.commit()
    
    # Add AI response to ChromaDB
    add_message_to_collection(
        chat_id=chat_id,
        message_id=ai_message.id,
        content=ai_response,
        sender="assistant",
        metadata={
            "model_used": chat.model,
            "rag_enabled": enable_rag,
            "context_count": len(context_messages)
        }
    )
    
    return jsonify({
        "user_message": user_message.to_dict(),
        "ai_message": ai_message.to_dict(),
        "context_used": len(context_messages) if enable_rag else 0
    }), 201


# Get conversation context for a message (for debugging/testing)
@chat_bp.route("/chat/<int:chat_id>/context", methods=["POST"])
@jwt_required()
def get_message_context(chat_id):
    """Get conversation context for a message (for testing RAG)."""
    user_id = get_jwt_identity()
    data = request.json
    
    query = data.get("query")
    limit = data.get("limit", 5)
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
    
    # Verify chat belongs to user
    chat = Chat.query.filter_by(id=chat_id, user_id=user_id).first_or_404()
    
    # Get conversation context
    context = get_conversation_context(
        chat_id=chat_id,
        current_message=query,
        context_limit=limit
    )
    
    return jsonify({
        "query": query,
        "context_messages": context,
        "context_count": len(context)
    })