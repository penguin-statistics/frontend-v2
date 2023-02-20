

// messages are in the form of Record<string, string>.
// if the key of the message contains `path1.path2`, it should be converted to a corresponding object
// similarly, if the key of the message contains `path1.path2[number]`, it should be converted to a corresponding object with an array
// e.g. { 'path1.path2': 'value', 'path1.path3[0]': 'value1', 'path1.path3[1]': 'value2' } should be converted to { path1: { path2: 'value', path3: ['value1', 'value2'] } }
export function transformMessages (messages) {
  const transformedMessages = {};
  Object.keys(messages).forEach((key) => {
    const path = key.split('.');
    let current = transformedMessages;
    for (let i = 0; i < path.length; i++) {
      const pathPart = path[i];
      if (pathPart.endsWith(']')) {
        // array
        const arrayPath = pathPart.split('[');
        const arrayName = arrayPath[0];
        const arrayIndex = parseInt(arrayPath[1].replace(']', ''));
        if (!current[arrayName]) {
          current[arrayName] = [];
        }
        if (i === path.length - 1) { // last part of the path
          current[arrayName][arrayIndex] = messages[key] || undefined;
        } else {
          if (!current[arrayName][arrayIndex]) {
            current[arrayName][arrayIndex] = {};
          }
          current = current[arrayName][arrayIndex];
        }
      } else {
        // object
        if (i === path.length - 1) { // last part
          current[pathPart] = messages[key] || undefined
        } else {
          if (!current[pathPart]) {
            current[pathPart] = {};
          }
          current = current[pathPart];
        }
      }
    }
  });
  return transformedMessages;
}
