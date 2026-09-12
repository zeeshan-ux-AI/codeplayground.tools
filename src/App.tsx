import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import WebEditor from "@/pages/web-editor";
import HtmlOnlyEditor from "@/pages/html-only-editor";
import ReactEditor from "@/pages/react-editor";
import VueEditor from "@/pages/vue-editor";
import SvelteEditor from "@/pages/svelte-editor";
import PythonEditor from "@/pages/python-editor";
import TypeScriptEditor from "@/pages/typescript-editor";
import JsEditor from "@/pages/js-editor";
import MarkdownEditor from "@/pages/markdown-editor";
import SqlEditor from "@/pages/sql-editor";
import CanvasEditor from "@/pages/canvas-editor";
import JsonEditor from "@/pages/json-editor";
import CssEditor from "@/pages/css-editor";
import RegexEditor from "@/pages/regex-editor";
import GraphqlEditor from "@/pages/graphql-editor";
import RustEditor from "@/pages/rust-editor";
import GoEditor from "@/pages/go-editor";
import CppEditor from "@/pages/cpp-editor";
import JavaEditor from "@/pages/java-editor";
import PhpEditor from "@/pages/php-editor";
import YamlEditor from "@/pages/yaml-editor";
import WasmEditor from "@/pages/wasm-editor";
import ShareView from "@/pages/share-view";

import GenericCompiler from "@/pages/generic-compiler";
import { COMPILERS_REGISTRY } from "@/lib/compilers-registry";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/editor" component={WebEditor} />
      <Route path="/html-editor" component={WebEditor} />
      <Route path="/web-editor" component={WebEditor} />
      <Route path="/html-only-editor" component={HtmlOnlyEditor} />
      <Route path="/react-editor" component={ReactEditor} />
      <Route path="/vue-editor" component={VueEditor} />
      <Route path="/svelte-editor" component={SvelteEditor} />
      <Route path="/python-editor" component={PythonEditor} />
      <Route path="/typescript-editor" component={TypeScriptEditor} />
      <Route path="/js-editor" component={JsEditor} />
      <Route path="/markdown-editor" component={MarkdownEditor} />
      <Route path="/sql-editor" component={SqlEditor} />
      <Route path="/canvas-editor" component={CanvasEditor} />
      <Route path="/json-editor" component={JsonEditor} />
      <Route path="/css-editor" component={CssEditor} />
      <Route path="/regex-editor" component={RegexEditor} />
      <Route path="/graphql-editor" component={GraphqlEditor} />
      <Route path="/rust-editor" component={RustEditor} />
      <Route path="/go-editor" component={GoEditor} />
      <Route path="/cpp-editor" component={CppEditor} />
      <Route path="/java-editor" component={JavaEditor} />
      <Route path="/php-editor" component={PhpEditor} />
      <Route path="/yaml-editor" component={YamlEditor} />
      <Route path="/wasm-editor" component={WasmEditor} />
      
      {/* Route all remaining compilers from 60 suite registry */}
      {COMPILERS_REGISTRY.map((c) => (
        <Route key={c.id} path={c.href}>
          {() => <GenericCompiler id={c.id} />}
        </Route>
      ))}

      <Route path="/p/:shareId" component={ShareView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
