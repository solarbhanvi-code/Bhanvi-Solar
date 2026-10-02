import type { Faq } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) {
    return <p className="text-sm text-muted-foreground">No FAQs available yet.</p>;
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq._id} value={faq._id}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>
            <p className="whitespace-pre-line">{faq.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
