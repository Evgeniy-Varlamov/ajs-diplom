# Диплом AJS: Retro Game
## Ссылки.
* [GithubPage](task/) [![Build status](https://ci.appveyor.com/api/projects/status/ir1x857t7j390efr?svg=true)](https://ci.appveyor.com/project/Evgeniy-Varlamov/ajs-diplom)
* [Дипломное задание](https://evgeniy-varlamov.github.io/ajs-diplom/)
## Пояснение работы логики загрузки/сохранения игры и подсчета очков.
**GamePoints** – очки набираемые игроком в течении одной игры на протяжении всех уровней.  
**TotalPoint** – количество очков набранное игроком на протяжении всех игр.  
### При проигрыше: 
- GamePoints очки сгорают, 
- количество очков TotalPoint не изменяется.
- Есть возможность загрузить сохраненную игру (если игра сохранялась). В этом случае очки GamePoints восстановятся в количестве равном количеству очков на момент сохранения.  
### При Выигрыше (прохождении всех уровней)
- Очки TotalPoint увеличиваются на количество очков GamePoints
- Очки GamePoints обнуляются
- Сохраненная игра удаляется.
