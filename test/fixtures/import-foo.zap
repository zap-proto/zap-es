# Based on https://github.com/jdiaz5513/capnp-ts (MIT - Julián Díaz)

@0xfc552bdafbb0b889;

using Cxx = import "/zap/c++.zap";
using Bar = import "import-bar.zap";

$Cxx.namespace("Initrode");

const baz :Bar.Baz = ();

struct Foo {
  const bazConst :Bar.Baz = ();
  baz @0 :Bar.Baz;
}
