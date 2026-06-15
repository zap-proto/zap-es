# zap-es — ARCHIVED

> **This package is archived.** Its source has been absorbed into
> **[`@zap-proto/zap`](https://github.com/zap-proto/ts) v2.0** — the ZAP
> foundation layer (Cap'n-Proto codec + Level-4 RPC + compiler).
>
> - Install: `pnpm add @zap-proto/zap`
> - Repo: https://github.com/zap-proto/ts
> - Docs: https://zap-proto.dev/docs/sdks/typescript
>
> Migration is a clean break (no compatibility shim). The only public change is
> the package name and the `./codec` / `./rpc` entry split:
>
> ```ts
> // before (zap-es)
> import { Message, Struct } from "zap-es";
> import { Conn } from "zap-es"; // rpc was bundled into the root
>
> // after (@zap-proto/zap v2.0)
> import { Message, Struct } from "@zap-proto/zap"; // codec (full runtime)
> import { Conn } from "@zap-proto/zap/rpc"; // focused RPC entry
> ```
>
> This repository is kept read-only as historical reference.

---

`zap-es` was the TypeScript Cap'n-Proto wire encoder for the ZAP binary RPC
protocol — a fork of [`unjs/capnp-es`](https://github.com/unjs/capnp-es). It is
now `@zap-proto/zap` v2.0.

## License

MIT.
