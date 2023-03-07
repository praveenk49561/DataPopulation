import alphabets from "./alphabets.js";

const stop = (ms = 100) => new Promise((res, rej) => {
    setTimeout(() => {
        res();
    }, ms)
});

const getSpacing = (len = 0) => {
    let spacing = '';
    for (let i = 0; i < len; i++) {
        spacing = spacing + ' ';
    };
    return spacing;
};

const makePattern = async (matrix = [], symbol = '[[', slowBy = 0) => {
    const spacing = getSpacing(symbol?.length);
    for (let i = 0; i < matrix?.length; i++) {
        for (let j = 0; j < matrix[i]?.length; j++) {
            if (slowBy) 
                await stop(slowBy);
            process?.stdout?.write(matrix[i][j] ? symbol : spacing);
        }
        process?.stdout?.write('\n');
    }
}

const getMatrix = (meta = '', source = alphabets) => {
    return alphabets[meta?.trim()?.toUpperCase()];
};

const horizontal = async (text = '', slowBy = 0) => {
    const reqMatrix = [];
    const reqMatrixOfText = [];
    for (let i = 0; i < text?.length; i++) {
        reqMatrixOfText?.push(getMatrix(text[i]) ?? []);
    }

    for (let i = 0; i < reqMatrixOfText[0]?.length; i++) {
        let data = [];
        for (let j = 0; j < reqMatrixOfText?.length; j++) {
            data = [...data, ...reqMatrixOfText[j][i] ?? [], 0];
        };
        reqMatrix?.push(data);
    };

    await makePattern(reqMatrix, '%%', slowBy);
}

const vertical = async (text = '', slowBy = 0) => {
    for (let i = 0; i < text?.length; i++) {
        const reqMatrix = getMatrix(text[i]);
        await makePattern(reqMatrix, '##', slowBy);
        process?.stdout?.write('\n');
    }
}


export const loader = async () => {
    const loadingText = 'Hola !!';
    await horizontal(loadingText);
};