// 核心解密函数（参数均为HEX字符串）
async function decryptHex(ciphertextHex, tagHex, ivHex, keyHex, aadHex) {
    // HEX清洗处理（兼容大小写/空格/特殊字符）
    const cleanHex = (hexStr) => {
        return hexStr ? hexStr.replace(/[^0-9a-f]/gi, '').toLowerCase() : '';
    };

    // 组合密文与认证标签（基于网页3的GCM规范）
    const ciphertextBuf = hexToArrayBuffer(cleanHex(ciphertextHex));
    const tagBuf = hexToArrayBuffer(cleanHex(tagHex));
    const combinedData = new Uint8Array([
        ...new Uint8Array(ciphertextBuf),
        ...new Uint8Array(tagBuf)
    ]);

    // 执行解密（参考网页5的Web Crypto API）
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        hexToArrayBuffer(cleanHex(keyHex)),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
    );

    const plaintext = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: hexToArrayBuffer(cleanHex(ivHex)),
            additionalData: hexToArrayBuffer(cleanHex(aadHex)),
            tagLength: 128
        },
        cryptoKey,
        combinedData
    );

    return arrayBufferToHex(plaintext);
}

// HEX转ArrayBuffer（优化版，支持空值处理）
function hexToArrayBuffer(hexStr) {
    const cleanHex = hexStr.replace(/[^0-9a-f]/gi, ''); // 兼容非标准HEX输入
    const bytes = new Uint8Array(
        cleanHex.match(/[\da-f]{2}/gi)?.map(h => 
            parseInt(h, 16)
        ) || []
    );
    return bytes.buffer;
}

// ArrayBuffer转HEX（优化版）
function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => 
            b.toString(16).padStart(2, '0') // 自动补零处理
        ).join('');
}