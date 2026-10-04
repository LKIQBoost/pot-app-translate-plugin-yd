async function translate(text, from, to, options) {
    const { utils } = options;
    const { tauriFetch: fetch, CryptoJS } = utils;

    const URL = "https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4";
    const KEYFROM = "webfanyi.webmain";
    const CLIENT = "webmain";
    const SECRET = "t2he2k4m2g6QKRigK0KAmSpXKgAezywG";

    const q = text;
    const flag = `${q}${KEYFROM}`.length % 10;
    const t = `${Date.now()}${flag}`;
    const digest = CryptoJS.MD5(`${q}${KEYFROM}`).toString(CryptoJS.enc.Hex);
    const sign = CryptoJS.MD5(`${CLIENT}${q}${t}${SECRET}${digest}`).toString(CryptoJS.enc.Hex);

    const form = new FormData();
    form.append("q", q);
    form.append("from", from);
    form.append("to", to);
    form.append("sign", sign);
    form.append("t", t);
    form.append("client", CLIENT);
    form.append("keyfrom", KEYFROM);

    const res = await fetch(URL, {
        method: "POST",
        body: { type: "Form", payload: form },
        responseType: 2,
    });

    if (!res.ok) {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }

    const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

    if (data.fanyi && data.fanyi.tran) {
        return data.fanyi.tran;
    }

    const word = (data.ec && data.ec.word) || (data.ce && data.ce.word);
    if (word && word.trs && word.trs.length > 0) {
        const explanations = [];
        for (const tr of word.trs) {
            const value = tr.tran || tr["#text"] || tr["#tran"] || "";
            const explains = value.split(/[；;]/).map((e) => e.trim()).filter((e) => e.length > 0);
            if (explains.length > 0) {
                explanations.push({ trait: tr.pos || "", explains });
            }
        }
        if (explanations.length > 0) {
            const target = { explanations };
            const associations = [];
            if (word.wfs) {
                for (const wf of word.wfs) {
                    if (wf.wf) {
                        associations.push(`${wf.wf.name}: ${wf.wf.value}`);
                    }
                }
            }
            if (associations.length > 0) {
                target.associations = associations;
            }
            return target;
        }
    }

    if (data.web_trans && data.web_trans["web-translation"]) {
        for (const item of data.web_trans["web-translation"]) {
            if (item.trans && item.trans.length > 0 && item.trans[0].value) {
                return item.trans[0].value;
            }
        }
    }

    if (data.simple && data.simple.word && data.simple.word.length > 0 && data.simple.word[0]["return-phrase"]) {
        return data.simple.word[0]["return-phrase"];
    }

    throw JSON.stringify(data);
}
