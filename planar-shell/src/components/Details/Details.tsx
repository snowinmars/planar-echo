import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import type { FC } from 'react';

import styles from './Details.module.scss';

const Details: FC = () => {
  return (
    <>
      <Typography variant="h3">Принципы проекта</Typography>

      <Typography className={styles.h5} variant="h5">Цель - бессмертие историй</Typography>
      <Typography>
        Проприетарные форматы гниют. Planar-echo - проект мигрирации игр с InfinityEngine в открытые форматы.
      </Typography>
      <Typography>
        Доступность и читаемость — навсегда.
      </Typography>

      <Typography className={styles.h5} variant="h5">Способ - свободный код</Typography>
      <Typography>
        Planar-echo превращает проприетарную игру в приватные файлы текстового формата json/typescript, которые запускаются на open-source движке, без привязки к операционной системе или железу.
      </Typography>
      <Typography>
        Операции происходят локально на машине пользователя. Проект не монетизируется и выпускается под свободной лицензией.
      </Typography>

      <Typography className={styles.h5} variant="h5">Основа - право покупателя</Typography>
      <Typography>
        Игрок купил игру - с этого момента игра принадлежит пользователю. Planar-echo предоставляет слой совместимости между игрой и платформой запуска. Это не пиратство, так как данные, которые защищает авторское право, не распространяются. Это - совместимость (interoperability, fair use), стимулирующая продажи оригинала.
      </Typography>

      <Typography className={styles.h5} variant="h5">Следствие - свобода творчества</Typography>
      <Typography>
        Свободная лицензия на planar-echo снимает технические барьеры для улучшений и развития модификаций.
      </Typography>
    </>
  );
};

export default Details;
