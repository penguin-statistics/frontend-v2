// messages are in the form of Record<string, string>.
// if the key of the message contains `path1.path2`, it should be converted to a corresponding object
// e.g. { 'path1.path2': 'value', 'path1.path3': 'value' } => { path1: { path2: 'value', path3: 'value' } }
export function transformMessages(messages) {
  const transformedMessages = {};
  for (const key in messages) {
    const path = key.split('.');
    const value = messages[key];
    let current = transformedMessages;
    for (let i = 0; i < path.length; i++) {
      const pathKey = path[i];
      if (i === path.length - 1) {
        current[pathKey] = value;
      } else {
        if (!current[pathKey]) {
          current[pathKey] = {};
        }
        current = current[pathKey];
      }
    }
  }
  return transformedMessages;
}
