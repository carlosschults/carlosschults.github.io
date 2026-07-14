---
title: "Operador LIKE do PostgreSQL: Um Guia Detalhado"
ref: postgresql-like-operator-guide
lang: pt
layout: post
author: Carlos Schults
original: https://coderpad.io/blog/development/postgresql-like-operator-a-detailed-guide/
description: "Um guia detalhado sobre o operador LIKE do PostgreSQL, cobrindo como ele funciona, em que difere do ILIKE, e exemplos práticos incluindo wildcards, buscas negativas e escape de caracteres."
permalink: /pt/guia-operador-like-postgresql
tags:
- databases
- postgresql
- sql
---

{% capture content %}
*Nota editorial: escrevi esse post originalmente para o blog da CoderPad. Você pode [conferir o original aqui, em inglês, no site deles]({{ page.original }}).*
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

Ao trabalhar com bancos de dados, precisar buscar valores que correspondam a um padrão é bem comum. Você pode querer achar todos os alunos que o sobrenome comece com uma determinada letra, ou atualizar todos os produtos cujo id contenha uma string específica. Se você usa PostgreSQL, vai usar o operador `LIKE` para isso.

Se você quer aprender mais sobre o `LIKE` do PostgreSQL, chegou ao lugar certo, já que este post é totalmente dedicado a esse operador. Ao final do post, você vai ter aprendido:

- o que o `LIKE` do PostgreSQL faz, e por que você gostaria de usá-lo
- como ele difere do operador `LIKE` em diferentes bancos de dados
- como ele difere do operador `ILIKE`

Mas só teoria sem prática iriam tornar esse post chato demais. Então, antes de encerrar, você vai ver exemplos do operador `LIKE` na prática.

**Pré-requisitos**

Se você quiser acompanhar a parte prática do post, você vai precisar de:

- instância funcional do PostgreSQL instalada na sua máquina
- conseguir se conectar a essa instância através de um cliente
- ter ao menos um pouco de experiência com o banco de dados PostgreSQL e com a linguagem SQL

**LIKE do PostgreSQL: Fundamentos**

Com os pré-requisitos resolvidos, vamos começar cobrindo alguns fundamentos sobre o assunto de hoje.

**O Que É o `LIKE` do PostgreSQL?**

O `LIKE` do PostgreSQL é a implementação, feita pelo PostgreSQL, do operador `LIKE` da linguagem SQL. Você usa o LIKE quando quer encontrar linhas nas quais uma ou mais colunas textuais correspondem a um determinado padrão. Na introdução, dei um exemplo: achar alunos cujo sobrenome comece com uma determinada letra. Então, vamos ver uma query real que faz exatamente isso usando o `LIKE` do PostgreSQL:

```sql
SELECT id, first_name, last_name, email FROM students WHERE last_name LIKE 'M%';
```

A query acima recupera algumas colunas da tabela `students`, mas apenas as linhas que atendem à condição: o valor da coluna `last_name` precisa começar com a letra "M". Tem alguns pontos interessantes neste primeiro exemplo:

- Você usa o operador `LIKE` na cláusula `WHERE` de uma query
- Ele vai no mesmo lugar em que você colocaria qualquer operador de comparação, como "==", ">", "<", e assim por diante
- O caractere de porcentagem (%) é usado como um wildcard para corresponder a qualquer quantidade de caracteres

E se você quisesse apenas os alunos cujo primeiro nome termina com "k"? Simples, basta trocar a letra e o wildcard de posição:

```sql
SELECT id, first_name, last_name, email FROM students WHERE first_name LIKE '%k';
```

Outro exemplo: vamos buscar alunos cujo endereço de e-mail contenha a palavra "gmail":

```sql
SELECT id, first_name, last_name, email FROM students WHERE email LIKE '%gmail%';
```

Isso mesmo: se você quer buscar valores que contenham uma string, basta envolver a string com sinais de porcentagem (`%`).

**Qual a Diferença Entre LIKE e ILIKE no PostgreSQL?**

Ao ler código PostgreSQL por aí, você pode encontrar queries que usam o operador `ILIKE` em vez do `LIKE` e ficar confuso. A diferença é que o operador `LIKE` diferencia maiúsculas de minúsculas (é *case sensitive*). Já o operador `ILIKE` não diferencia (é *case insensitive*) — daí o "i" no nome. Ele não distingue letras maiúsculas de minúsculas, e por isso você deveria usá-lo quando não se importa com a caixa das letras.

Um detalhe importante a se ter em mente: o operador `ILIKE` não existe no SQL ANSI; na verdade, é uma extensão específica do PostgreSQL. Isso significa que usar o ILIKE torna seu código SQL menos portável, caso você precise trocar de banco de dados no futuro.

**LIKE do PostgreSQL: Casos de Uso Práticos**

Tendo coberto o básico sobre o `LIKE` do PostgreSQL, vamos agora ver vários exemplos de uso. Vamos começar preparando o banco de dados para os testes.

**Preparando o Banco de Dados**

Usando seu cliente preferido, conecte-se à sua instância do PostgreSQL, garantindo que existe um banco de dados ao qual você pode se conectar para os testes.

Vamos começar criando uma tabela e inserindo algumas linhas nela:

```sql
CREATE TABLE albums (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(250) NOT NULL,
  artist          VARCHAR(250) NOT NULL,
  release_year int NOT NULL);

INSERT INTO albums (title, artist, release_year) VALUES('Abbey Road', 'The Beatles', 1969);
INSERT INTO albums  (title, artist, release_year) VALUES('Construção', 'Chico Buarque', 1971);
INSERT INTO albums  (title, artist, release_year) VALUES('The Dark Side of the Moon', 'Pink Floyd', 1973);
INSERT INTO albums  (title, artist, release_year) VALUES('Reckless', 'Bryan Adams', 1984);
INSERT INTO albums  (title, artist, release_year) VALUES('Ryan Adams', 'Ryan Adams', 2014);
```

**Correspondendo a um Único Caractere**

Como você viu, a tabela agora contém álbuns tanto do Bryan quanto do Ryan Adams. Isso não é coincidência. Primeiro, use a seguinte query para recuperar álbuns dos dois cantores:

```sql
SELECT * FROM albums WHERE artist LIKE '%yan%';
```

A query acima corresponde a todos os artistas que contenham a string "yan" em qualquer parte do nome. Veja como fica o resultado:

```
 id |   title    |   artist    | release_year 
----+------------+-------------+--------------
  4 | Reckless   | Bryan Adams |         1984
  5 | Ryan Adams | Ryan Adams  |         2014
(2 rows)
```

O operador `LIKE` oferece um wildcard adicional, o caractere de sublinhado (_), que corresponde a um único caractere. Dessa forma, é possível reescrever a query de modo que apenas Ryan Adams seja retornado:

```sql
SELECT * FROM albums WHERE artist LIKE '_yan%';
```

E aqui, novamente, está o resultado:

```
 id |   title    |   artist   | release_year 
----+------------+------------+--------------
  5 | Ryan Adams | Ryan Adams |         2014
(1 row)
```

**Correspondências Negativas**

Ao trabalhar com tabelas de banco de dados, muitas vezes você precisa recuperar dados que *não* correspondam a um certo padrão. Para isso, você pode usar o operador `NOT LIKE`. Por exemplo, vamos buscar apenas artistas cujo nome não comece com "The":

```sql
SELECT * FROM albums WHERE artist NOT LIKE 'The%';
```

Já que o único artista que começa com "The" é The Beatles, ele não será retornado pela query acima.

**Correspondência Sem Diferenciar Maiúsculas de Minúsculas**

Como falei antes, o operador `ILIKE` é uma extensão especial do PostgreSQL para o `LIKE` que faz correspondências sem diferenciar maiúsculas de minúsculas. Vamos ver isso na prática. Primeiro, vamos usar o operador `LIKE` para obter todos os artistas que contenham um "A" maiúsculo:

```sql
SELECT * FROM albums WHERE artist LIKE '%A%';
```

Apenas "Bryan Adams" e "Ryan Adams" são retornados, o que faz sentido:

```
 id |   title    |   artist    | release_year 
----+------------+-------------+--------------
  4 | Reckless   | Bryan Adams |         1984
  5 | Ryan Adams | Ryan Adams  |         2014
(2 rows)
```

Agora vamos substituir o operador `LIKE` pelo `ILIKE` e rodar a query novamente:

```sql
SELECT * FROM albums WHERE artist ILIKE '%A%';
```

```
 id |   title    |    artist     | release_year 
----+------------+---------------+--------------
  1 | Abbey Road | The Beatles   |         1969
  2 | Construção | Chico Buarque |         1971
  4 | Reckless   | Bryan Adams   |         1984
  5 | Ryan Adams | Ryan Adams    |         2014
(4 rows)
```

Agora, todos os artistas são retornados, exceto Pink Floyd.

**Escapando os Wildcards**

Para este exemplo, vamos atualizar duas linhas:

```sql
UPDATE albums SET artist = 'The%Beatles' WHERE id = 1;
UPDATE albums SET artist = 'Chico_Buarque' WHERE id = 2;
```

Agora, digamos que queremos recuperar álbuns de artistas cujo nome contenha um sinal de porcentagem ou um sublinhado:

```sql
SELECT * FROM albums WHERE artist LIKE '%%%';
SELECT * FROM albums WHERE artist LIKE '%_%';
```

Como você provavelmente já imaginou, nenhuma das duas queries funciona: ambas retornam todas as linhas. Felizmente, existe uma forma de contornar esse problema: é possível escapar um wildcard para usá-lo como um caractere normal. Basta colocar uma barra invertida antes do caractere problemático:

```sql
SELECT * FROM albums WHERE artist LIKE '%\%%';
```

E aqui está o resultado:

```
 id |   title    |    artist     | release_year 
----+------------+---------------+--------------
  1 | Abbey Road | The Beatles   |         1969
(1 rows)
```

O mesmo funcionaria para o caractere de sublinhado. Mas, antes de encerrar, vamos complicar as coisas só um pouco mais — porque sim.

Primeiro, vamos atualizar a linha do "Abbey Road" mais uma vez:

```sql
UPDATE albums SET artist = 'The\Beatles' WHERE id = 1;
```

Agora, para usar o LIKE e recuperar uma linha que contenha o caractere de barra invertida, você teria que escrever esta query:

```sql
SELECT * FROM albums WHERE artist LIKE '%\\%';
```

Você precisa escapar o caractere de escape. Não é tão terrível assim, mas talvez você queira escrever uma versão mais legível. Se for esse o caso, é possível escolher um caractere diferente como caractere de escape: basta usar a cláusula `ESCAPE`:

```sql
SELECT * FROM albums WHERE artist LIKE '%$\%' ESCAPE '$';
```

Com a cláusula `ESCAPE`, você pode escolher um caractere diferente para servir de escape. Dessa forma — pelo menos na minha opinião — a query resultante fica mais explícita quanto à forma como escapa o wildcard.

**Conclusão: LIKE do PostgreSQL: Aprenda e Aproveite**

Neste post, você aprendeu sobre o operador LIKE no PostgreSQL: o que é, para que serve, e como funciona, através de vários exemplos. Como você viu, o funcionamento do operador é bem simples assim que você entende como os wildcards funcionam. Também percorremos alguns exemplos de uso, como correspondência a um único caractere e a realização de correspondências negativas.

Para onde ir agora? Para começar, continue aprendendo sobre correspondência de padrões no PostgreSQL. Aqui vão algumas sugestões de tópicos:

- `SIMILAR TO`, uma cláusula mais recente
- a função `substring()`
- a função `regexp_like()`

Obrigado pela leitura, até a próxima!