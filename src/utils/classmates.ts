const NAMES_BY_CLASS: Record<string, string[]> = {
  nobility: ['Edmund', 'Thomas', 'Geoffrey', 'Margaret', 'Eleanor', 'Richard', 'Isabella'],
  gentry: ['Edward', 'Henry', 'Catherine', 'Anne', 'Elizabeth', 'Francis', 'Grace'],
  artisan: ['John', 'William', 'Alice', 'Mary', 'Robert', 'Jane', 'Samuel'],
  peasant: ['Peter', 'Agnes', 'Thomas', 'Beatrice', 'Roger', 'Martha', 'Simon'],
};

export function generateClassmates(socialClass: string, count: number = 4) {
  const names = NAMES_BY_CLASS[socialClass] || NAMES_BY_CLASS.peasant;
  const usedNames: string[] = [];
  const classmates = [];

  for (let i = 0; i < count; i++) {
    let name = names[Math.floor(Math.random() * names.length)];
    // Evitar nomes duplicados
    while (usedNames.includes(name) && usedNames.length < names.length) {
      name = names[Math.floor(Math.random() * names.length)];
    }
    usedNames.push(name);

    classmates.push({
      id: `classmate_${i}_${Date.now()}`,
      name,
      relationship: Math.floor(Math.random() * 40) + 20, // 20-60
      socialClass,
    });
  }

  return classmates;
}

export function getClassmateTitle(socialClass: string): string {
  const titles: Record<string, string> = {
    nobility: 'Companheiros da Corte',
    gentry: 'Colegas de Estudo',
    artisan: 'Colegas de Ofício',
    peasant: 'Crianças da Vila',
  };
  return titles[socialClass] || 'Companheiros';
}

export function generateNewClassmateName(socialClass: string): string {
  const names = NAMES_BY_CLASS[socialClass] || NAMES_BY_CLASS.peasant;
  return names[Math.floor(Math.random() * names.length)];
}
