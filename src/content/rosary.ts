export type RosaryMysteryKey = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export interface RosaryDecade {
  title: string;
  reference: string;
  meditation: string;
}

export interface RosaryMysterySet {
  key: RosaryMysteryKey;
  title: string;
  shortTitle: string;
  days: string;
  sourceNote: string;
  decades: RosaryDecade[];
}

export interface WeekdayOption {
  id: string;
  label: string;
  shortLabel: string;
  dayIndex: number;
}

export const weekdayOptions: WeekdayOption[] = [
  { id: 'sunday', label: 'Domingo', shortLabel: 'Dom', dayIndex: 0 },
  { id: 'monday', label: 'Segunda-feira', shortLabel: 'Seg', dayIndex: 1 },
  { id: 'tuesday', label: 'Terça-feira', shortLabel: 'Ter', dayIndex: 2 },
  { id: 'wednesday', label: 'Quarta-feira', shortLabel: 'Qua', dayIndex: 3 },
  { id: 'thursday', label: 'Quinta-feira', shortLabel: 'Qui', dayIndex: 4 },
  { id: 'friday', label: 'Sexta-feira', shortLabel: 'Sex', dayIndex: 5 },
  { id: 'saturday', label: 'Sábado', shortLabel: 'Sáb', dayIndex: 6 },
];

export const rosaryMysteryByDay: Record<number, RosaryMysteryKey> = {
  0: 'glorious',
  1: 'joyful',
  2: 'sorrowful',
  3: 'glorious',
  4: 'luminous',
  5: 'sorrowful',
  6: 'joyful',
};

export const rosaryMysteries: Record<RosaryMysteryKey, RosaryMysterySet> = {
  joyful: {
    key: 'joyful',
    title: 'Mistérios Gozosos',
    shortTitle: 'Gozosos',
    days: 'Segundas-feiras e sábados',
    sourceNote: 'Distribuição tradicional indicada pela Santa Sé para o Santo Rosário.',
    decades: [
      {
        title: 'Anunciação a Maria',
        reference: 'Lc 1,26-38',
        meditation:
          'Contemple a humildade de Maria diante da vontade de Deus. Peça a graça de dizer sim sem reservas quando o Senhor chamar.',
      },
      {
        title: 'Visitação de Nossa Senhora a Santa Isabel',
        reference: 'Lc 1,39-56',
        meditation:
          'Maria leva Cristo a quem precisa. Peça um coração pronto para servir, visitar, consolar e levar Deus aos outros.',
      },
      {
        title: 'Nascimento de Jesus',
        reference: 'Lc 2,1-20',
        meditation:
          'O Filho de Deus nasce pobre e escondido. Peça desapego, simplicidade e amor por Jesus presente nas pequenas coisas.',
      },
      {
        title: 'Apresentação do Menino Jesus no Templo',
        reference: 'Lc 2,22-35',
        meditation:
          'Maria e José oferecem Jesus ao Pai. Ofereça também sua vida, seus deveres e suas dores como culto agradável a Deus.',
      },
      {
        title: 'Perda e encontro do Menino Jesus no Templo',
        reference: 'Lc 2,41-52',
        meditation:
          'Quem perde Jesus precisa procurá-lo com todo o coração. Peça fidelidade para voltar depressa quando se afastar.',
      },
    ],
  },
  luminous: {
    key: 'luminous',
    title: 'Mistérios Luminosos',
    shortTitle: 'Luminosos',
    days: 'Quintas-feiras',
    sourceNote: 'Mistérios da vida pública de Cristo propostos por São João Paulo II.',
    decades: [
      {
        title: 'Batismo de Jesus no rio Jordão',
        reference: 'Mt 3,13-17',
        meditation:
          'Jesus entra nas águas e revela sua missão. Renove a graça do seu batismo e peça docilidade ao Espírito Santo.',
      },
      {
        title: 'Autorrevelação de Jesus nas Bodas de Caná',
        reference: 'Jo 2,1-12',
        meditation:
          'Maria aponta para Cristo: fazei tudo o que Ele disser. Peça confiança obediente, mesmo quando a hora de Deus parece escondida.',
      },
      {
        title: 'Anúncio do Reino de Deus e convite à conversão',
        reference: 'Mc 1,14-15',
        meditation:
          'Cristo chama à conversão agora. Peça coragem para romper com o pecado concreto e crer de verdade no Evangelho.',
      },
      {
        title: 'Transfiguração de Jesus',
        reference: 'Mt 17,1-8',
        meditation:
          'No monte, Cristo mostra sua glória antes da cruz. Peça luz para permanecer fiel quando a fé exigir perseverança.',
      },
      {
        title: 'Instituição da Eucaristia',
        reference: 'Mt 26,26-29',
        meditation:
          'Jesus se dá como alimento. Peça amor à Missa, reverência diante do Santíssimo Sacramento e fome verdadeira de comunhão.',
      },
    ],
  },
  sorrowful: {
    key: 'sorrowful',
    title: 'Mistérios Dolorosos',
    shortTitle: 'Dolorosos',
    days: 'Terças e sextas-feiras',
    sourceNote: 'Mistérios da Paixão do Senhor, contemplados com Maria.',
    decades: [
      {
        title: 'Agonia de Jesus no Horto',
        reference: 'Mt 26,36-46',
        meditation:
          'Jesus aceita a vontade do Pai em meio à angústia. Peça contrição sincera e fidelidade quando obedecer custar.',
      },
      {
        title: 'Flagelação de Jesus',
        reference: 'Mt 27,24-26',
        meditation:
          'Cristo sofre no corpo por amor aos pecadores. Peça pureza, penitência e domínio dos sentidos.',
      },
      {
        title: 'Coroação de espinhos',
        reference: 'Mt 27,27-31',
        meditation:
          'O Rei é humilhado e permanece manso. Peça humildade para abandonar vaidade, soberba e desejo de aparecer.',
      },
      {
        title: 'Jesus carregando a cruz',
        reference: 'Mc 15,21-22',
        meditation:
          'O Senhor abraça a cruz sem fugir. Peça paciência para carregar seus deveres e unir seus sofrimentos aos dEle.',
      },
      {
        title: 'Crucifixão e morte de Jesus',
        reference: 'Lc 23,33-46',
        meditation:
          'Na cruz, Cristo entrega tudo e perdoa. Peça amor maior que o pecado e decisão firme de não ofendê-lo mais.',
      },
    ],
  },
  glorious: {
    key: 'glorious',
    title: 'Mistérios Gloriosos',
    shortTitle: 'Gloriosos',
    days: 'Quartas-feiras e domingos',
    sourceNote: 'Mistérios da vitória de Cristo e da esperança do céu.',
    decades: [
      {
        title: 'Ressurreição de Jesus',
        reference: 'Lc 24,1-12',
        meditation:
          'Cristo vence a morte. Peça fé viva, esperança firme e coragem para recomeçar depois das quedas.',
      },
      {
        title: 'Ascensão de Jesus ao Céu',
        reference: 'Mc 16,19-20',
        meditation:
          'Jesus sobe ao Pai e abre o caminho do céu. Peça desapego da terra e desejo santo da vida eterna.',
      },
      {
        title: 'Vinda do Espírito Santo',
        reference: 'At 2,1-4',
        meditation:
          'O Espírito Santo transforma discípulos medrosos em testemunhas. Peça fortaleza, luz e zelo apostólico.',
      },
      {
        title: 'Assunção de Maria',
        reference: 'Lc 1,48-49',
        meditation:
          'Maria é elevada ao céu em corpo e alma. Peça pureza, perseverança e confiança na intercessão da Mãe de Deus.',
      },
      {
        title: 'Coroação de Maria no Céu',
        reference: 'Ap 12,1',
        meditation:
          'Maria reina junto de seu Filho e intercede por nós. Peça fidelidade filial e a graça de chegar ao céu.',
      },
    ],
  },
};

export const rosaryIntentionSuggestions = [
  'Pelo Santo Padre e pelas necessidades da Igreja',
  'Pelos bispos, sacerdotes, diáconos e seminaristas',
  'Pelas almas do purgatório',
  'Pela conversão dos pecadores',
  'Pela santificação das famílias',
  'Pelos doentes, idosos e pessoas que sofrem sozinhas',
  'Pelas vocações sacerdotais e religiosas',
  'Pela paz e pelo fim das guerras',
  'Pelos agonizantes e por uma boa morte',
  'Pelos que ainda não conhecem Cristo',
  'Pela perseverança dos que lutam contra pecados habituais',
  'Em reparação aos Sagrados Corações de Jesus e Maria',
];

export function getRosaryMysteryForDate(date = new Date()): RosaryMysterySet {
  return rosaryMysteries[rosaryMysteryByDay[date.getDay()]];
}

export function getWeekdayForDate(date = new Date()): WeekdayOption {
  return weekdayOptions[date.getDay()];
}
