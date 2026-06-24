import { MCP_TOOLS, REST_ROUTES } from "@/src/domain/agent-surface";

export function AgentLayerCallout() {
  return (
    <details className="mt-10 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-500">
        Agent layer — MCP & REST
      </summary>

      <div className="mt-4 space-y-5 text-sm text-slate-600 dark:text-slate-400">
        <p>
          The dashboard is one consumer of a shared domain layer. Internal GTM
          workflows can read the same account context via{" "}
          <strong className="font-medium text-slate-800 dark:text-slate-200">
            read-only MCP tools
          </strong>{" "}
          or REST routes — no duplicate Salesforce/Gong/Zendesk glue and no
          write-back to source systems.
        </p>

        <p className="text-xs text-slate-500">
          Briefing generation stays in the web app (validation +{" "}
          <code className="font-mono">briefing_runs</code> audit). MCP does not
          trigger LLM inference.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              MCP tools (local: npm run mcp)
            </h3>
            <ul className="mt-2 space-y-2">
              {MCP_TOOLS.map((tool) => (
                <li key={tool.name}>
                  <code className="font-mono text-xs text-slate-800 dark:text-slate-200">
                    {tool.name}
                  </code>
                  <span className="block text-xs">{tool.purpose}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              REST API
            </h3>
            <ul className="mt-2 space-y-2">
              {REST_ROUTES.map((route) => (
                <li key={`${route.method}-${route.path}`}>
                  <span className="font-mono text-xs text-slate-800 dark:text-slate-200">
                    {route.method} {route.path}
                  </span>
                  <span className="block text-xs">{route.purpose}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </details>
  );
}
