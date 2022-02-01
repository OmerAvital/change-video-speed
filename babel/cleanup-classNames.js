const cleanUp = s => s.replace(/\s+/gm, ' ');
const cleanUpRaw = s => s.replace(/\s*\\?\s+/gm, ' ');

module.exports = () => ({
  visitor: {
    JSXAttribute(path) {
      const { name, value } = path.node;

      if (name.name !== 'className') return;

      if (value.type === 'StringLiteral') {
        value.value = cleanUp(value.value);
        return;
      }

      if (value.type === 'JSXExpressionContainer' && value.expression.quasis) {
        value.expression.quasis.forEach(q => {
          q.value.cooked = cleanUp(q.value.cooked);
          q.value.raw = cleanUpRaw(q.value.raw);
        });
      }
    },
  },
});
