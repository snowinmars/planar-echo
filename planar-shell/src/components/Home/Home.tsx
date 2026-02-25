import { FC } from 'react';
import styles from './Home.module.scss';
import { useCountStoreCount } from '@/engine/store/count';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// import registerNpcDialogue from "@/engine/dialogues/registerNpcDialogue";
// import translateNpcDialogue from "@/engine/dialogues/translateNpcDialogue";

// export type Morte1Logic = Readonly<{
//     talkMorte: () => void;
// }>;
// const morte1Logic: Morte1Logic = {
//     talkMorte: () => {},
// };
// const morte1DialogueSkeleton = registerNpcDialogue<Morte1Logic>()
//     .label('morte1_s0', {
//         onlyIf: () => true,
//         weight: 1,
//         onEnter: (l) => {
//             l.talkMorte();
//             return {
//                 id: 'playSound',
//                 args: {
//                     sound: 'morte1_s0',
//                 }
//             }
//         }
//     })
//     .say()
//     .response('morte1_s0_r39793', 'morte1_s1')

//     .label('morte1_s1')
//     .say()
//     .response('morte1_s1_r39796', 'morte1_s2')
//     .response('morte1_s1_r39797', 'morte1_s3')

//     .done()
// ;
// const morte1Dialogue = translateNpcDialogue(morte1DialogueSkeleton, 'ru_RU')
//     .label('morte1_s0')
//     .say('morte', '«Эй, шеф. Ты в порядке?»')
//     .say('morte', '«Изображаешь из себя труп или пытаешься обмануть трухлявых?».')
//     .say('morte', '«Я уж думал, что ты дал дуба».')
//     .response('morte1_s0_r39793', '«Чт?.. Ты кто?»')

//     .label('morte1_s1')
//     .say('morte', '«Э… кто я? А как насчет *тебя* для начала? Кто ты?»')
//     .response('morte1_s1_r39796', '«Я… не знаю. Не могу вспомнить».')
//     .response('morte1_s1_r39797', '«Я *первый* спросил тебя, череп».')

//     .done()
// ;

const Home: FC = () => {
    const {
        count,
        countInc,
        countDec,
    } = useCountStoreCount();

    return (
        <div className={styles.home}>
            <Typography>
                {count}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={countInc}
            >
                +
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={countDec}
            >
                -
            </Button>
        </div>
    );
}

export default Home;
