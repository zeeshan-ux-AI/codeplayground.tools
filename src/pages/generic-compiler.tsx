import React from "react";
import { COMPILERS_REGISTRY } from "@/lib/compilers-registry";
import { UniversalCompilerShell } from "@/components/editor/universal-compiler-shell";
import NotFound from "@/pages/not-found";

interface GenericCompilerProps {
  id: string;
}

export default function GenericCompiler({ id }: GenericCompilerProps) {
  const compiler = COMPILERS_REGISTRY.find((c) => c.id === id);

  if (!compiler) {
    return <NotFound />;
  }

  return <UniversalCompilerShell compiler={compiler} />;
}
