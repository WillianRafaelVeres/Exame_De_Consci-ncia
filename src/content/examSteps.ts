import { ExamStep } from '../types';

export const examSteps: ExamStep[] = [
  {
    id: 'step_0_prayer',
    title: 'Oração Inicial',
    subtitle: 'Comece pedindo a luz do Espírito Santo',
    type: 'prayer',
    content: `Vinde, Espírito Santo,
enchei os corações dos vossos fiéis
e acendei neles o fogo do vosso amor.

Enviai o vosso Espírito e tudo será criado,
e renovareis a face da terra.

Ó Deus, que instruístes os corações dos fiéis
com a luz do Espírito Santo,
fazei que pelo mesmo Espírito
tenhamos o gosto das coisas retas
e gozemos sempre de sua consolação.
Por Cristo Nosso Senhor. Amém.

Senhor Jesus Cristo,
em vossa presença me coloco agora.
Iluminai minha consciência com a vossa luz,
para que eu possa ver com verdade
os caminhos que percorri hoje.

Não venho com medo, mas com confiança
na vossa misericórdia sem limites.
Amém.`,
  },
  {
    id: 'step_1_gratitude',
    title: 'Gratidão do Dia',
    subtitle: 'Reconheça as bênçãos recebidas',
    type: 'reflection',
    content: `Antes de examinar o que fiz de errado,
reconheça primeiro o bem que Deus operou em você hoje.

Pergunte-se:

• Por quem ou pelo que sou grato hoje?
• Houve um momento de beleza, alegria ou amparo que não percebi plenamente?
• Quem cruzou meu caminho como um presente?
• Em que momento senti a presença de Deus agindo em minha vida?

Permaneça em silêncio por alguns momentos,
deixando o coração se encher de gratidão antes de prosseguir.`,
  },
  {
    id: 'step_2_commandments',
    title: 'Exame pelos Mandamentos',
    subtitle: 'Revisão à luz da Lei de Deus',
    type: 'questions',
    questions: [
      {
        id: 'q_cmd_1',
        text: 'Coloquei Deus em primeiro lugar hoje, ou outras coisas — trabalho, prazer, preocupações — tomaram o lugar que é dEle?',
        commandment: '1º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_2',
        text: 'Usei o nome de Deus, de Jesus ou de Maria de forma leviana, como xingamento ou blasfêmia?',
        commandment: '2º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_3',
        text: 'Participei da Missa quando era obrigatório? Tratei o domingo como dia sagrado ou simplesmente como folga?',
        commandment: '3º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_4',
        text: 'Fui respeitoso e grato com meus pais, ou os tratei com impaciência e indiferença?',
        commandment: '4º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_5',
        text: 'Alimentei ódio, rancor ou desejo de mal a alguém? Fui imprudente de modo a colocar vidas em risco?',
        commandment: '5º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_6',
        text: 'Guardei a castidade segundo meu estado de vida, no olhar, nos pensamentos, nas conversas e nos atos?',
        commandment: '6º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_7',
        text: 'Fui justo com bens, dinheiro, trabalho, contratos e aquilo que pertence ao próximo?',
        commandment: '7º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_8',
        text: 'Menti, exagerei, difamei, caluniei ou omiti a verdade quando ela era devida?',
        commandment: '8º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_9',
        text: 'Cultivei desejos, fantasias ou proximidade afetiva que ferem a fidelidade ou a pureza de coração?',
        commandment: '9º Mandamento',
        category: 'Mandamentos',
      },
      {
        id: 'q_cmd_10',
        text: 'Desejei desordenadamente bens, posição ou sucesso de outras pessoas, deixando nascer inveja ou amargura?',
        commandment: '10º Mandamento',
        category: 'Mandamentos',
      },
    ],
  },
  {
    id: 'step_3_capital_sins',
    title: 'Exame pelos Pecados Capitais',
    subtitle: 'Reconheça as raízes dos seus vícios',
    type: 'questions',
    questions: [
      {
        id: 'q_soberba',
        text: 'Recusei corrigir um erro, busquei reconhecimento excessivo ou tratei alguém com condescendência hoje?',
        category: 'Soberba',
      },
      {
        id: 'q_avareza',
        text: 'Fui apegado ao dinheiro ou bens a ponto de recusar ajudar quem precisava, ou fui guiado pelo ganho nas minhas decisões?',
        category: 'Avareza',
      },
      {
        id: 'q_luxuria',
        text: 'Consenti em pensamentos ou olhares impuros, ou busquei prazer de forma contrária à castidade?',
        category: 'Luxúria',
      },
      {
        id: 'q_ira',
        text: 'Perdi a paciência, falei com crueldade, guardei rancor ou usei o silêncio para punir alguém?',
        category: 'Ira',
      },
      {
        id: 'q_gula',
        text: 'Exagerei na comida, bebida ou no uso de telas e entretenimento, perdendo o domínio de mim mesmo?',
        category: 'Gula',
      },
      {
        id: 'q_inveja',
        text: 'Senti tristeza com o sucesso de alguém ou desejei que outro falhasse ou perdesse algo?',
        category: 'Inveja',
      },
      {
        id: 'q_preguica',
        text: 'Negligenciei a oração, os deveres de família ou trabalho, ou passei tempo excessivo em distrações vazias?',
        category: 'Preguiça',
      },
    ],
  },
  {
    id: 'step_4_state_of_life',
    title: 'Exame pelo Estado de Vida',
    subtitle: 'Seus deveres particulares como pessoa e cristão',
    type: 'questions',
    questions: [
      {
        id: 'q_family',
        text: 'Fui presente de verdade com minha família hoje? Dediquei atenção real ao cônjuge, filhos ou pais, ou fiquei "presente" só fisicamente?',
        category: 'Família',
      },
      {
        id: 'q_work',
        text: 'Fui honesto, justo e diligente no trabalho, ou fui negligente, desonesto ou tratei mal colegas e subordinados?',
        category: 'Trabalho',
      },
      {
        id: 'q_relationships',
        text: 'Nas amizades e relações sociais, fui leal, verdadeiro e edificante? Ou contribuí com fofoca, hipocrisia ou influência negativa?',
        category: 'Relações',
      },
      {
        id: 'q_church',
        text: 'Cumpri as obrigações da vida cristã que me são próprias (oração, formação, obras de misericórdia) ou as negligencie sem motivo sério?',
        category: 'Vida Cristã',
      },
    ],
  },
  {
    id: 'step_5_notes',
    title: 'Anotações Finais',
    subtitle: 'Espaço livre para sua reflexão pessoal',
    type: 'notes',
    content: 'Anote qualquer pensamento, sentimento ou resolução que surja desta reflexão. Este espaço é seu.',
  },
  {
    id: 'step_6_contrition',
    title: 'Ato de Contrição',
    subtitle: 'Encerre com arrependimento sincero',
    type: 'contrition',
    content: `Meu Deus,
pesa-me muito ter-Vos ofendido,
porque sois infinitamente bom
e o pecado Vos desagrada.

Proponho firmemente,
com o auxílio da vossa graça,
não Vos ofender mais
e evitar as ocasiões próximas de pecado.

Senhor, misericórdia.
Amém.`,
  },
];
