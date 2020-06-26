# Диплом AJS: Retro Game
## Ссылки.
* [GithubPage](https://evgeniy-varlamov.github.io/ajs-diplom/) [![Build status](https://ci.appveyor.com/api/projects/status/ir1x857t7j390efr?svg=true)](https://ci.appveyor.com/project/Evgeniy-Varlamov/ajs-diplom)
* [Дипломное задание](task/)
## Пояснение работы логики загрузки/сохранения игры и подсчета очков.
**Points Game** – очки набираемые игроком в течении одной игры на протяжении всех уровней.  
**Total Points** – количество очков набранное игроком на протяжении всех игр.  
### При проигрыше: 
- Points Game очки сгорают, 
- количество очков Total Points не изменяется.
- Есть возможность загрузить сохраненную игру (если игра сохранялась). В этом случае очки Points Game восстановятся в количестве равном количеству очков на момент сохранения.  
### При Выигрыше (прохождении всех уровней)
- Очки Total Points увеличиваются на количество очков Points Game
- Очки Points Game обнуляются
- Сохраненная игра удаляется.
