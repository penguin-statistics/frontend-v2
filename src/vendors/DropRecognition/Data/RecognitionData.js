class RecognitionData {
  /**
   *
   * @param {Object} Data
   */
  static Encode(Data) {
    let Id = Object.keys(Data);
    let keySize = Id.reduce((a, b) => a + b.length, 0);
    let DataSize = Math.ceil((Data[Id[0]][0].length * 3) / 8) * Id.length;
    let PrefixSize = Id.length;
    let HeaderSize = 2;
    let AllSize = PrefixSize + keySize + DataSize + HeaderSize;
    let DataBuffer = new Uint8Array(AllSize);
    let index = 0;
    // Write Header
    DataBuffer[index++] = 1; //Version
    DataBuffer[index++] = (Data[Id[0]][0].length >> 8) & 0b11111111;
    DataBuffer[index++] = Data[Id[0]][0].length & 0b11111111;

    //
    for (let [k, v] of Object.entries(Data)) {
      DataBuffer[index++] = k.length;
      // Write Key
      for (let s of k) {
        DataBuffer[index++] = s.charCodeAt(0);
      }
      v = [].concat(...v);
      let Byte = 0;
      let BitI = 0;
      for (let [i, bit] of v.entries()) {
        if (bit) {
          Byte = (Byte << 1) + 1;
        } else {
          Byte = Byte << 1;
        }
        if (++BitI == 8 || i == v.length - 1) {
          Byte = Byte << (8 - BitI);
          DataBuffer[index++] = Byte;
          Byte = 0;
          BitI = 0;
        }
      }
    }
    return DataBuffer;
  }
  static Decode(Encoded) {
    let Index = 0;
    //let Version = Encoded[Index++];
    Index++;
    let BitLength = (Encoded[Index] << 8) | Encoded[Index + 1];
    Index += 2;
    let Mode = "KeySize";
    let Key = "";
    let KeySize = 0;
    let KeyIndex = 0;
    let Data = [[], [], []];
    let DataC = 0;
    let OutPut = {};
    for (; Index < Encoded.length; Index++) {
      let Byte, BinByte;
      switch (Mode) {
        case "KeySize":
          KeySize = Encoded[Index];
          Mode = "Key";
          KeyIndex = 0;
          Key = "";
          break;
        case "Key":
          Key += String.fromCharCode(Encoded[Index]);
          if (++KeyIndex == KeySize) {
            Mode = "Data";
            DataC = 0;
            Data = [[], [], []];
          }
          break;
        case "Data":
          Byte = Encoded[Index];
          BinByte = Byte.toString("2")
            .padStart(8, "0")
            .split("");
          for (let Bit of BinByte) {
            if (Data[DataC].push(Bit == "1") == BitLength) {
              if (++DataC == 3) {
                OutPut[Key] = Data;
                Mode = "KeySize";
                break;
              }
            }
          }
          break;
      }
    }
    return OutPut;
  }
}
module.exports = RecognitionData;
