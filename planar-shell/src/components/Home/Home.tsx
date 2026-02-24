import { FC } from 'react';
import styles from './Home.module.scss';
import { useCountStoreCount } from '@/engine/store/count';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

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
