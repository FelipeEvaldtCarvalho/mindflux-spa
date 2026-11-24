/// <reference types="vite/client" />

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /** Só usuários com perfil admin acessam. */
    requiresAdmin?: boolean;
  }
}
