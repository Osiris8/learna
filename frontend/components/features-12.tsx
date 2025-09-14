"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Bot, Code, GraduationCap, Pencil, Stethoscope, TreeDeciduous } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BorderBeam } from "@/components/magicui/border-beam";
import code from "@/public/code.png";
import design from "@/public/design.png";
import learn from "@/public/learn.png";
import agriculture_agent from "@/public/agriculture-agent.png";
import { Book } from "lucide-react";
export default function Features() {
  type ImageKey = "item-1" | "item-2" | "item-3";
  const [activeItem, setActiveItem] = useState<ImageKey>("item-1");

  const images = {
    "item-1": {
      image: learn,
      alt: "Learn",
    },
    "item-2": {
      image: code,
      alt: "Code",
    },
    "item-3": {
      image: design,
      alt: "Design",
    },
  
  };

  return (
    <section className="py-12 md:py-20 lg:py-32" id="features">
      <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-6xl">
            Discover Your AI Tutor
          </h2>
          <p>
          Your AI mentor to learn anything and faster.
          </p>
        </div>

        <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
          <Accordion
            type="single"
            value={activeItem}
            onValueChange={(value) => setActiveItem(value as ImageKey)}
            className="w-full"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <Book className="size-4" />
                  Learn
                </div>
              </AccordionTrigger>
              <AccordionContent>
               <ul className="list-disc">
            <li>Clear, personalized explanations for any concept. </li>
            <li>Interactive quizzes and practical exercises.</li> 
            <li> Track your progress with tailored learning paths.</li>
            </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <Code className="size-4" />
                  Code
                </div>
              </AccordionTrigger>
              <AccordionContent>
              <ul className="list-disc">
            <li>Generate clean and optimized code in seconds.</li>
            <li>Supports multiple languages (JavaScript, Python, TypeScript, and more).</li> 
            <li>Step-by-step explanations to help you understand while you build.</li>
            </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-base">
                  <Pencil className="size-4" />
                  Design
                </div>
              </AccordionTrigger>
              <AccordionContent>
              <ul className="list-disc">
            <li>Create modern interfaces with reusable components and layouts.</li>
            <li>Get smart suggestions for colors, typography, and styles.</li> 
            <li>Generate responsive and accessible designs instantly.</li>
            </ul>
              </AccordionContent>
            </AccordionItem>
          
          </Accordion>

          <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
            {/*  <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>*/}
            <div className="aspect-1/1 object-cover  bg-background relative w-full rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeItem}-id`}
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
                >
                  <Image
                    src={images[activeItem].image}
                    className="size-full object-cover object-left-top dark:mix-blend-lighten"
                    alt={images[activeItem].alt}
                    width={1207}
                    height={929}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
