import type { ReactNode } from "react";
import { Panel } from "@/components/ui";

type CalloutProps = {
  title: string;
  children: ReactNode;
};

export function Callout({ title, children }: CalloutProps) {
  return (
    <Panel as="div" className="mdx-callout p-5 sm:p-6" radius="card" tone="muted">
      <p className="mdx-callout-title">
        {title}
      </p>
      <div className="mdx-callout-body">
        {children}
      </div>
    </Panel>
  );
}
