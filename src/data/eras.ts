/**
 * DEFINIÇÃO DE ERAS HISTÓRICAS POR REGIÃO
 * Cada região tem sua própria linha do tempo
 */

export interface Era {
  id: string;
  name: string;
  yearStart: number;
  yearEnd: number;
  description: string;
  tags: string[]; // Para filtrar eventos
}

export const ERAS = {
  // === INGLATERRA ===
  Inglaterra: [
    {
      id: 'tudor',
      name: 'Era Tudor/Stuart',
      yearStart: 1500,
      yearEnd: 1699,
      description: 'Reinado das dinastias Tudor e Stuart. Época de reforma religiosa e conflitos.',
      tags: ['medieval', 'monarchy', 'plague', 'religion', 'feudal'],
    },
    {
      id: 'georgian',
      name: 'Era Georgiana',
      yearStart: 1700,
      yearEnd: 1849,
      description: 'Revolução agrícola e início da industrialização. Império em expansão.',
      tags: ['preindustrial', 'monarchy', 'colonial', 'agriculture'],
    },
    {
      id: 'victorian',
      name: 'Era Vitoriana',
      yearStart: 1850,
      yearEnd: 1919,
      description: 'Auge do Império Britânico e Revolução Industrial.',
      tags: ['industrial', 'empire', 'factory', 'urbanization', 'wwi'],
    },
    {
      id: 'modern',
      name: 'Era Moderna',
      yearStart: 1920,
      yearEnd: 1999,
      description: 'Pós-guerras mundiais, welfare state e declínio imperial.',
      tags: ['postwar', 'welfare', 'technology', 'democracy', 'wwii'],
    },
    {
      id: 'contemporary',
      name: 'Era Contemporânea',
      yearStart: 2000,
      yearEnd: 2100,
      description: 'Globalização, tecnologia digital e desafios climáticos.',
      tags: ['digital', 'globalization', 'tech', 'climate', 'brexit'],
    },
  ],

  // === AMÉRICA DO NORTE (EUA) ===
  'América do Norte': [
    {
      id: 'colonial',
      name: 'Era Colonial',
      yearStart: 1500,
      yearEnd: 1699,
      description: 'Colonização inglesa. Sobrevivência extrema no Novo Mundo.',
      tags: ['colonial', 'survival', 'natives', 'wilderness', 'hunger'],
    },
    {
      id: 'independence',
      name: 'Era da Independência',
      yearStart: 1700,
      yearEnd: 1849,
      description: 'Revolução Americana e expansão para o Oeste.',
      tags: ['revolution', 'independence', 'frontier', 'expansion', 'pioneer'],
    },
    {
      id: 'industrial',
      name: 'Era Industrial',
      yearStart: 1850,
      yearEnd: 1919,
      description: 'Guerra Civil e crescimento industrial acelerado.',
      tags: ['civilwar', 'industrial', 'gilded', 'railroad', 'immigration'],
    },
    {
      id: 'modern',
      name: 'Era Moderna',
      yearStart: 1920,
      yearEnd: 1999,
      description: 'Ascensão como superpotência global.',
      tags: ['superpower', 'wwii', 'coldwar', 'space', 'prosperity'],
    },
    {
      id: 'contemporary',
      name: 'Era Contemporânea',
      yearStart: 2000,
      yearEnd: 2100,
      description: 'Era digital e polarização política.',
      tags: ['digital', 'tech', 'terrorism', 'polarization', 'climate'],
    },
  ],
};

/**
 * Retorna a era atual baseada na localização e ano
 */
export function getCurrentEra(location: string, year: number): Era | null {
  const locationEras = ERAS[location as keyof typeof ERAS];
  if (!locationEras) return null;

  return locationEras.find(
    (era) => year >= era.yearStart && year <= era.yearEnd
  ) || null;
}

/**
 * Verifica se o personagem acabou de entrar em uma nova era
 */
export function didEraChange(location: string, oldYear: number, newYear: number): Era | null {
  const oldEra = getCurrentEra(location, oldYear);
  const newEra = getCurrentEra(location, newYear);

  if (!oldEra || !newEra) return null;
  if (oldEra.id !== newEra.id) return newEra;
  
  return null;
}
