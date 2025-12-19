export function encodeBalance(balance: number) {
    const str = balance.toString();

    const dotIndex = str.indexOf(".");
    if (dotIndex === -1) {
        return {
            updatedNumber: Number(str),
            dotIndex: -1,
        };
    }

    const updatedNumber = Number(str.replace(".", ""));

    return {
        updatedNumber,
        dotIndex,
    };
}


export function decodeBalance(encodedBalance: number, dotIndex: number) {
    let str = encodedBalance.toString();

    if (dotIndex !== -1) {
        str =
            str.slice(0, dotIndex) +
            "." +
            str.slice(dotIndex);
    }

    return Number(Number(str).toFixed(2));
}
