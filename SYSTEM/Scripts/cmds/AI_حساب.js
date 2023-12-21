const math = require('mathjs');

module.exports = {
  config: {
    name: 'حاسبة',
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 2,
    category: 'الذكاء',
    guide: '{pn} عملية مثل 181 × 10202',
    price: 0,
    reward: 0,
    description: 'يحسب العمليات 🌝',
    inbox: true
  },
  atCall: async function({ args, message }) {
    if (!args[0]) return message.reply('أكتب: /حاسبة عملية');
    const X = args.join(' ');
    const F = P(X);
    
     try {
       const D = M(F);
       message.reply(X + ' = ' + D);
     } catch (W) {
       message.reply(W.message);
     }
  }
};

function P(Z) {
    const A = Z.replace(/(\d+)\s√\s(\d+)/g, '$1 sqrt($2)');
    const J = A
     .replace(/÷/g, '/')
     .replace(/×/g, '*');
    return J;
}

function M(B) {
  try {
    const L = math.evaluate(B);
    return L;
  } catch (C) {
    throw new Error('لا ندعم هذا النوع من العمليات 😡📕.');
  }
}
