import CardanoWasm from "@emurgo/cardano-serialization-lib-nodejs";

const plutusDataToObj = (plutus) => {
    switch(plutus.kind()) {
        case CardanoWasm.PlutusDataKind.ConstrPlutusData: {
            const data = plutus.as_constr_plutus_data().data();
            const elems = [];
            for(let i=0; i<data.len(); ++i) {
                elems.push(plutusDataToObj(data.get(i)));
            }
            return elems;
        }
        case CardanoWasm.PlutusDataKind.Map: {
            const data = plutus.as_map();
            const keys = data.keys();
            const elems = {};
            for(let i=0; i<keys.len(); ++i) {
                const key = keys.get(i);
                const value = data.get(key);
                elems[plutusDataToObj(key)] = plutusDataToObj(value);
            }
            return elems;
        }
        case CardanoWasm.PlutusDataKind.List: {
            const data = plutus.as_list();
            const elems = [];
            for(let i=0; i<data.len(); ++i) {
                elems.push(plutusDataToObj(data.get(i)));
            }
            return elems;
        }
        case CardanoWasm.PlutusDataKind.Integer: {
            return plutus.as_integer().to_str();
        }
        case CardanoWasm.PlutusDataKind.Bytes: {
            return Buffer.from(plutus.as_bytes()).toString("hex");
        }
        default:
            return null;
    }
};

const hexes = [
    "d8799f190159581caa19f7457e305e26740e9d55554695b06fbe264997ba1337d397da8cd87a80ff",
    "d8799f1a02aea540581c3feba3e7056736b5e5c129c758df14a5e7f3ea9663cac735cc71fcc7d87a80ff",
    "d8799f1a02b730c0581c3feba3e7056736b5e5c129c758df14a5e7f3ea9663cac735cc71fcc7d87a80ff",
    "d8799f1a01e84800581caa19f7457e305e26740e9d55554695b06fbe264997ba1337d397da8cd87a80ff",
];

for(const hex of hexes) {
    const data = CardanoWasm.PlutusData.from_bytes(Buffer.from(hex, "hex"));
    console.log(JSON.stringify(plutusDataToObj(data), null, 2));
}
