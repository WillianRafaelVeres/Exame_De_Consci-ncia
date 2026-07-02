export type RosaryMysteryKey = 'joyful' | 'luminous' | 'sorrowful' | 'glorious';

export interface RosaryDecade {
  title: string;
  reference: string;
  scripture: string;
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

export interface RosaryIntentionSuggestionGroup {
  theme: string;
  suggestions: string[];
}

export const weekdayOptions: WeekdayOption[] = [
  { id: 'sunday', label: 'Domingo', shortLabel: 'Dom', dayIndex: 0 },
  { id: 'monday', label: 'Segunda-feira', shortLabel: 'Seg', dayIndex: 1 },
  { id: 'tuesday', label: 'Terca-feira', shortLabel: 'Ter', dayIndex: 2 },
  { id: 'wednesday', label: 'Quarta-feira', shortLabel: 'Qua', dayIndex: 3 },
  { id: 'thursday', label: 'Quinta-feira', shortLabel: 'Qui', dayIndex: 4 },
  { id: 'friday', label: 'Sexta-feira', shortLabel: 'Sex', dayIndex: 5 },
  { id: 'saturday', label: 'Sabado', shortLabel: 'Sab', dayIndex: 6 },
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
    title: 'Misterios Gozosos',
    shortTitle: 'Gozosos',
    days: 'Segundas-feiras e sabados',
    sourceNote: 'Misterios da infancia de Jesus, contemplados com Maria.',
    decades: [
      {
        title: 'Anunciacao a Maria',
        reference: 'Lc 1,26-38',
        scripture:
          'O anjo Gabriel foi enviado por Deus a uma virgem chamada Maria. Ele a saudou: "Alegra-te, cheia de graca, o Senhor esta contigo". Maria perguntou como aquilo aconteceria, e o anjo respondeu que o Espirito Santo viria sobre ela. Entao Maria disse: "Eis aqui a serva do Senhor; faca-se em mim segundo a tua palavra".',
        meditation:
          'Contemple a humildade de Maria diante da vontade de Deus. Peca a graca de dizer sim sem reservas quando o Senhor chamar.',
      },
      {
        title: 'Visitacao de Nossa Senhora a Santa Isabel',
        reference: 'Lc 1,39-56',
        scripture:
          'Maria partiu apressadamente para a regiao montanhosa e entrou na casa de Zacarias, saudando Isabel. Ao ouvir a saudacao, Isabel ficou cheia do Espirito Santo e bendisse Maria entre as mulheres. Maria respondeu engrandecendo o Senhor e reconhecendo que Deus olhou para a humildade de sua serva.',
        meditation:
          'Maria leva Cristo a quem precisa. Peca um coracao pronto para servir, visitar, consolar e levar Deus aos outros.',
      },
      {
        title: 'Nascimento de Jesus',
        reference: 'Lc 2,1-20',
        scripture:
          'Jose e Maria foram a Belem, e ali chegou o tempo de ela dar a luz. Maria teve seu filho primogenito, envolveu-o em faixas e o colocou numa manjedoura, porque nao havia lugar para eles. Os pastores receberam o anuncio do anjo e foram encontrar Maria, Jose e o Menino.',
        meditation:
          'O Filho de Deus nasce pobre e escondido. Peca desapego, simplicidade e amor por Jesus presente nas pequenas coisas.',
      },
      {
        title: 'Apresentacao do Menino Jesus no Templo',
        reference: 'Lc 2,22-35',
        scripture:
          'Maria e Jose levaram o Menino a Jerusalem para apresenta-lo ao Senhor. Simeao tomou Jesus nos bracos, bendisse a Deus e anunciou que Ele seria luz para as nacoes. Tambem disse a Maria que uma espada atravessaria sua alma.',
        meditation:
          'Maria e Jose oferecem Jesus ao Pai. Ofereca tambem sua vida, seus deveres e suas dores como culto agradavel a Deus.',
      },
      {
        title: 'Perda e encontro do Menino Jesus no Templo',
        reference: 'Lc 2,41-52',
        scripture:
          'Depois da festa em Jerusalem, Maria e Jose perceberam que Jesus nao estava com a caravana. Voltaram a procura-lo e, depois de tres dias, o encontraram no Templo, entre os doutores. Jesus voltou com eles para Nazare e era-lhes obediente, enquanto Maria guardava tudo no coracao.',
        meditation:
          'Quem perde Jesus precisa procura-lo com todo o coracao. Peca fidelidade para voltar depressa quando se afastar.',
      },
    ],
  },
  luminous: {
    key: 'luminous',
    title: 'Misterios Luminosos',
    shortTitle: 'Luminosos',
    days: 'Quintas-feiras',
    sourceNote: 'Misterios da vida publica de Cristo propostos por Sao Joao Paulo II.',
    decades: [
      {
        title: 'Batismo de Jesus no rio Jordao',
        reference: 'Mt 3,13-17',
        scripture:
          'Jesus veio da Galileia ao Jordao para ser batizado por Joao. Depois do batismo, saiu da agua, os ceus se abriram e o Espirito de Deus desceu sobre Ele como uma pomba. Entao veio uma voz do ceu: "Este e o meu Filho amado, em quem me comprazo".',
        meditation:
          'Jesus entra nas aguas e revela sua missao. Renove a graca do seu batismo e peca docilidade ao Espirito Santo.',
      },
      {
        title: 'Autorrevelacao de Jesus nas Bodas de Cana',
        reference: 'Jo 2,1-12',
        scripture:
          'Nas bodas de Cana, faltou o vinho. Maria disse a Jesus: "Eles nao tem vinho", e depois orientou os serventes: "Fazei tudo o que Ele vos disser". Jesus mandou encher as talhas de agua, e a agua se tornou vinho. Assim manifestou sua gloria, e os discipulos creram nele.',
        meditation:
          'Maria aponta para Cristo: fazei tudo o que Ele disser. Peca confianca obediente, mesmo quando a hora de Deus parece escondida.',
      },
      {
        title: 'Anuncio do Reino de Deus e convite a conversao',
        reference: 'Mc 1,14-15',
        scripture:
          'Jesus foi para a Galileia proclamando o Evangelho de Deus. Ele dizia: "Completou-se o tempo, e o Reino de Deus esta proximo. Convertei-vos e crede no Evangelho".',
        meditation:
          'Cristo chama a conversao agora. Peca coragem para romper com o pecado concreto e crer de verdade no Evangelho.',
      },
      {
        title: 'Transfiguracao de Jesus',
        reference: 'Mt 17,1-8',
        scripture:
          'Jesus levou Pedro, Tiago e Joao a um alto monte. Ali foi transfigurado diante deles: seu rosto brilhou como o sol e suas vestes ficaram luminosas. Uma nuvem os cobriu, e uma voz disse: "Este e o meu Filho amado; escutai-o".',
        meditation:
          'No monte, Cristo mostra sua gloria antes da cruz. Peca luz para permanecer fiel quando a fe exigir perseveranca.',
      },
      {
        title: 'Instituicao da Eucaristia',
        reference: 'Mt 26,26-29',
        scripture:
          'Durante a ceia, Jesus tomou o pao, pronunciou a bencao, partiu-o e o deu aos discipulos dizendo: "Tomai e comei, isto e o meu corpo". Depois tomou o calice e disse: "Bebei dele todos, pois isto e o meu sangue da alianca".',
        meditation:
          'Jesus se da como alimento. Peca amor a Missa, reverencia diante do Santissimo Sacramento e fome verdadeira de comunhao.',
      },
    ],
  },
  sorrowful: {
    key: 'sorrowful',
    title: 'Misterios Dolorosos',
    shortTitle: 'Dolorosos',
    days: 'Tercas e sextas-feiras',
    sourceNote: 'Misterios da Paixao do Senhor, contemplados com Maria.',
    decades: [
      {
        title: 'Agonia de Jesus no Horto',
        reference: 'Mt 26,36-46',
        scripture:
          'Jesus foi com os discipulos ao Getsemani e comecou a entristecer-se profundamente. Afastou-se para rezar e disse: "Meu Pai, se e possivel, afaste-se de mim este calice; contudo, nao seja como eu quero, mas como tu queres".',
        meditation:
          'Jesus aceita a vontade do Pai em meio a angustia. Peca contricao sincera e fidelidade quando obedecer custar.',
      },
      {
        title: 'Flagelacao de Jesus',
        reference: 'Mt 27,24-26',
        scripture:
          'Pilatos viu que nada conseguia e que a confusao aumentava. Entao soltou Barrabas ao povo e mandou flagelar Jesus, entregando-o para ser crucificado.',
        meditation:
          'Cristo sofre no corpo por amor aos pecadores. Peca pureza, penitencia e dominio dos sentidos.',
      },
      {
        title: 'Coroacao de espinhos',
        reference: 'Mt 27,27-31',
        scripture:
          'Os soldados reuniram-se em torno de Jesus, vestiram-no com um manto, trancaram uma coroa de espinhos e a colocaram em sua cabeca. Zombavam dele, dizendo: "Salve, rei dos judeus". Depois o levaram para ser crucificado.',
        meditation:
          'O Rei e humilhado e permanece manso. Peca humildade para abandonar vaidade, soberba e desejo de aparecer.',
      },
      {
        title: 'Jesus carregando a cruz',
        reference: 'Mc 15,21-22',
        scripture:
          'Levaram Jesus para fora a fim de crucifica-lo. Obrigaram Simao de Cirene, que passava pelo caminho, a carregar a cruz. Conduziram Jesus ao lugar chamado Golgota.',
        meditation:
          'O Senhor abraca a cruz sem fugir. Peca paciencia para carregar seus deveres e unir seus sofrimentos aos dEle.',
      },
      {
        title: 'Crucifixao e morte de Jesus',
        reference: 'Lc 23,33-46',
        scripture:
          'No Calvario, Jesus foi crucificado entre dois malfeitores. Ele rezou: "Pai, perdoa-lhes, porque nao sabem o que fazem". Depois, clamou em alta voz: "Pai, em tuas maos entrego o meu espirito", e expirou.',
        meditation:
          'Na cruz, Cristo entrega tudo e perdoa. Peca amor maior que o pecado e decisao firme de nao ofende-lo mais.',
      },
    ],
  },
  glorious: {
    key: 'glorious',
    title: 'Misterios Gloriosos',
    shortTitle: 'Gloriosos',
    days: 'Quartas-feiras e domingos',
    sourceNote: 'Misterios da vitoria de Cristo e da esperanca do ceu.',
    decades: [
      {
        title: 'Ressurreicao de Jesus',
        reference: 'Lc 24,1-12',
        scripture:
          'No primeiro dia da semana, as mulheres foram ao tumulo e encontraram a pedra removida. Dois homens com vestes luminosas disseram: "Por que procurais entre os mortos aquele que vive? Ele nao esta aqui; ressuscitou".',
        meditation:
          'Cristo vence a morte. Peca fe viva, esperanca firme e coragem para recomecar depois das quedas.',
      },
      {
        title: 'Ascensao de Jesus ao Ceu',
        reference: 'Mc 16,19-20',
        scripture:
          'Depois de falar aos discipulos, o Senhor Jesus foi elevado ao ceu e sentou-se a direita de Deus. Os discipulos partiram e anunciaram a Palavra, enquanto o Senhor cooperava com eles.',
        meditation:
          'Jesus sobe ao Pai e abre o caminho do ceu. Peca desapego da terra e desejo santo da vida eterna.',
      },
      {
        title: 'Vinda do Espirito Santo',
        reference: 'At 2,1-4',
        scripture:
          'No dia de Pentecostes, estavam todos reunidos no mesmo lugar. Veio do ceu um ruido como vento impetuoso, e apareceram linguas como de fogo. Todos ficaram cheios do Espirito Santo e comecaram a anunciar as maravilhas de Deus.',
        meditation:
          'O Espirito Santo transforma discipulos medrosos em testemunhas. Peca fortaleza, luz e zelo apostolico.',
      },
      {
        title: 'Assuncao de Maria',
        reference: 'Lc 1,48-49',
        scripture:
          'Maria proclamou: "Todas as geracoes me chamarao bem-aventurada, porque o Poderoso fez em mim grandes coisas". A Igreja contempla nessa promessa a vitoria de Deus na vida da Mae do Senhor, elevada ao ceu em corpo e alma.',
        meditation:
          'Maria e elevada ao ceu em corpo e alma. Peca pureza, perseveranca e confianca na intercessao da Mae de Deus.',
      },
      {
        title: 'Coroacao de Maria no Ceu',
        reference: 'Ap 12,1',
        scripture:
          'Apareceu no ceu um grande sinal: uma mulher vestida de sol, com a lua debaixo dos pes e uma coroa de doze estrelas sobre a cabeca. A Igreja contempla em Maria a Rainha que intercede por seus filhos.',
        meditation:
          'Maria reina junto de seu Filho e intercede por nos. Peca fidelidade filial e a graca de chegar ao ceu.',
      },
    ],
  },
};

export const rosaryIntentionSuggestionsByDay: Record<string, RosaryIntentionSuggestionGroup> = {
  sunday: {
    theme: 'Ressurreicao, familia e gratidao',
    suggestions: [
      'Em acao de gracas pela semana que passou',
      'Pela santificacao da minha familia',
      'Pelos que participam da Missa dominical sem fervor',
      'Pelos que perderam a esperanca',
      'Pela perseveranca dos recem-convertidos',
      'Pelos jovens e criancas da familia',
      'Pelos que precisam recomecar depois de uma queda',
      'Pela alegria crista no lar',
    ],
  },
  monday: {
    theme: 'Humildade, vocacao e comeco da semana',
    suggestions: [
      'Para dizer sim a vontade de Deus nesta semana',
      'Pelas vocacoes sacerdotais e religiosas',
      'Pelas maes, gestantes e criancas pequenas',
      'Pelos que precisam de trabalho digno',
      'Pela humildade nas conversas e decisoes',
      'Por uma pessoa que eu preciso visitar ou ajudar',
      'Pelo desapego dos bens e comodidades',
      'Pela fidelidade nos pequenos deveres',
    ],
  },
  tuesday: {
    theme: 'Conversao, penitencia e cura interior',
    suggestions: [
      'Pela conversao dos pecadores',
      'Pela minha conversao concreta neste pecado dominante',
      'Pelos que sofrem ansiedade, tristeza ou solidao',
      'Pelos que guardam ressentimento',
      'Pelos que estao afastados da confissao',
      'Pela pureza dos olhos, palavras e pensamentos',
      'Pelos que sofrem injusticas em silencio',
      'Pelos agonizantes e por uma boa morte',
    ],
  },
  wednesday: {
    theme: 'Esperanca, perseveranca e missao',
    suggestions: [
      'Pela perseveranca na vida de oracao',
      'Pelos catequistas, missionarios e evangelizadores',
      'Pelos que esfriaram na fe',
      'Pelos trabalhadores e estudantes',
      'Pela fortaleza nas tentacoes',
      'Pelos que precisam perdoar e pedir perdao',
      'Pela coragem de testemunhar Cristo',
      'Pela esperanca diante das dificuldades',
    ],
  },
  thursday: {
    theme: 'Santo Padre, Igreja e Eucaristia',
    suggestions: [
      'Pelo Santo Padre e pelas necessidades da Igreja',
      'Pelos bispos, sacerdotes, diaconos e seminaristas',
      'Pelo aumento do amor a Eucaristia',
      'Pelas vocacoes sacerdotais',
      'Pelos ministros e servidores da liturgia',
      'Pelos que nao conhecem Cristo',
      'Pela unidade da Igreja',
      'Em reparacao pelas ofensas ao Santissimo Sacramento',
    ],
  },
  friday: {
    theme: 'Paixao, reparacao e misericordia',
    suggestions: [
      'Em reparacao aos Sagrados Coracoes de Jesus e Maria',
      'Pelos doentes, idosos e pessoas que sofrem sozinhas',
      'Pelos perseguidos por causa da fe',
      'Pelos que carregam cruzes pesadas na familia',
      'Pela libertacao de pecados habituais',
      'Pelos que precisam reconciliar-se com Deus',
      'Pelos que morreram sem preparacao',
      'Pela paciencia e mansidao nas humilhacoes',
    ],
  },
  saturday: {
    theme: 'Nossa Senhora, pureza e almas do purgatorio',
    suggestions: [
      'Pelas almas do purgatorio',
      'Pela consagracao da minha familia a Nossa Senhora',
      'Pela pureza do coracao',
      'Pelos filhos afastados da fe',
      'Pelas mulheres que sofrem em silencio',
      'Pelas criancas em perigo espiritual ou material',
      'Pela fidelidade ao Rosario',
      'Por uma boa morte sob o olhar de Maria',
    ],
  },
};

export const rosaryIntentionSuggestions =
  rosaryIntentionSuggestionsByDay.thursday.suggestions;

export function getRosaryMysteryForDate(date = new Date()): RosaryMysterySet {
  return rosaryMysteries[rosaryMysteryByDay[date.getDay()]];
}

export function getWeekdayForDate(date = new Date()): WeekdayOption {
  return weekdayOptions[date.getDay()];
}

export function getRosarySuggestionGroupForDay(
  dayId: string
): RosaryIntentionSuggestionGroup {
  return (
    rosaryIntentionSuggestionsByDay[dayId] ??
    rosaryIntentionSuggestionsByDay.thursday
  );
}
