export function calculateMoneyResult(
  socialClass: string,
  relationship: number,
  age: number
): { success: boolean; amount: number; message: string } {
  if (age < 13) {
    return {
      success: false,
      amount: 0,
      message: 'Você é muito jovem para precisar de dinheiro.',
    };
  }

  let successChance = false;
  let maxAmount = 0;
  let failMessage = '';

  if (socialClass === 'peasant') {
    successChance = Math.random() < 0.05;
    maxAmount = 1;
    failMessage =
      'Seu pai suspirou: "Mal temos pão para o jantar, filho. Não tenho nada para lhe dar."';
  } else if (socialClass === 'artisan') {
    successChance = relationship > 50 && Math.random() < 0.4;
    maxAmount = Math.floor(Math.random() * 11) + 10; // $10-$20
    failMessage = 'Sua mãe disse que o comércio está fraco este mês.';
  } else if (socialClass === 'gentry') {
    successChance = relationship > 40 && Math.random() < 0.5;
    maxAmount = Math.floor(Math.random() * 51) + 50; // $50-$100
    failMessage = 'Seu pai disse que precisa manter as aparências primeiro.';
  } else if (socialClass === 'nobility') {
    successChance = relationship > 30 && Math.random() < 0.7;
    maxAmount = Math.floor(Math.random() * 101) + 100; // $100-$200
    failMessage = 'Seu pai está ocupado com assuntos da corte.';
  }

  if (successChance) {
    return {
      success: true,
      amount: maxAmount,
      message: `Você recebeu $${maxAmount}.`,
    };
  }

  return {
    success: false,
    amount: 0,
    message: failMessage || 'Não foi possível conseguir dinheiro.',
  };
}
