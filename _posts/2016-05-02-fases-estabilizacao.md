---
title: Fases de Estabilização
permalink: /pt/traducao-fases-estabilizacao/
lang: pt
ref: estabilizacao
layout: post
author: Carlos Schults
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1462111255/balance-min_qkdhxx.png
tags:
- traducoes
- metodologias-ageis
- integracao-continua
- testes-de-software
- testes-automatizados
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1462111255/balance-min_qkdhxx.png)

**NOTA**: O artigo a seguir foi originalmente escrito por Robert C. Martin, mais conhecido como Uncle Bob. Bob é um programador com décadas de experiência, autor de diversos livros (Código Limpo, por exemplo) e foi o organizador do encontro em 2001 que deu origem ao [Manifesto Para Desenvolvimento Ágil de Software](https://agilemanifesto.org/iso/ptbr/). Ele gentilmente me autorizou a fazer essa tradução. Caso lhe interesse, [clique aqui para ler o artigo original](https://blog.cleancoder.com/uncle-bob/2016/01/14/Stabilization.html).
<!--more-->
<hr>

Enquanto tomava meu café de manhã e dava uma olhada no facebook em meu celular, fui inundado com updates de status de proprietários de veículos Tesla que estavam animados porque seus carros agora poderiam entrar na garagem de maneira autônoma. Minha resposta a esses posts no facebook talvez tenha sido um pouco cínica; mas eu disse a todos eles: 
    
> Vai demorar muito até eu confiar em um software para dirigir o carro no qual eu estou.
> Porque eu -- **sei**.

Eu sei o quê? Eu sei o quão difícil é testar software para cada imprevisto. 
E eu sei como é fácil enganar a si próprio achando que você testou.

E isso me fez pensar sobre como você deveria testar o software de um carro autônomo.

E isso me fez pensar sobre como as pessoas de fato testam sistemas de software.

E isso finalmente me fez pensar sobre fases de estabilização.

Você sabe o que é uma fase de estabilização, não sabe? Uma fase de estabilização ocorre no final de uma release. Algum tempo é reservado para apenas deixar o sistema rodar. Por uma semana, ou um mês, todo mundo apenas assiste o sistema rodando. Eles o tratam como um bebê dormindo. Eles evitam barulhos altos, batidas de portas, e conversa alta. Eles andam nas pontas dos dedos, dando uma olhadinha de tempos em tempos, com a esperança de que ele não acorde e quebre.

OK, talvez isso seja um pouco exagarado. -- Talvez. Eu imagino que a maioria dos times que usam fases de estabilização realmente trabalham muito duro para estressar seus sistemas. Pelo menos eu espero que eles façam isso. Eles deveriam estar inserindo muitos dados no dados sob condições diversas; incluindo dados incorretos, e que causaram problemas no passado.

Mas essa é a coisa importante sobre fases de estabilização:
    
	Nós as usamos porque temos medo. 
	Nós temos medo porque não temos certeza do que o sistema irá fazer.

Há uma certa dissonância cognitiva entre dizer que somos profissionais, e sermos tão incertos sobre o que criamos que temos medo do que pode fazer. Geralmente se espera que uma equipe de profissionais tenha um alto grau de confiança e certeza.

Quanto maior o tempo de duração da fase de estabilização, menor é a certeza que o time tem sobre o sistema. As equipes que precisam de apenas um dia têm muito mais confiança em seus sistemas que as equipes que querem uma semana, ou um mês.

A falha lógica aqui é que tempo de execução indica qualidade. Mas tempo na verdade não é relacionado à qualidade. Tempo simplesmente cria falsa confiança.

O comportamento do sistema na fase de estabilização tem pouco ou nada a ver com o comportamento do sistema em produção; porque os dados entrando no sistema de produção são dados completamente novos. Os novos dados podem levar o sistema a percorrer caminhos que a fase de estabilização nunca executou.

Então fases de estabilização apenas criam falsa confiança. Elas são uma estratégia para "tirar o seu da reta." Quando o sistema falha em produção, você pode pelo menos dizer que você fez o esforço devido de rodar o sistema por um mês na fase de estabilização; dessa forma exonerando a equipe da culpa de deixar um defeito crítico entrar no sistema.

O problema crucial é que a fase de estabilização existe porque o time de desenvolvimento produziu código no qual eles não confiam. Então eles rodam o sistema por um mês para criar suficiente falsa confiança para enfrentar a incerteza.

O que a equipe realmente precisa fazer é atacar sua incerteza diretamente. Não rodando o sistema inutilmente por um mês; mas sim corrigindo os problemas no seu processo de desenvolvimento que criaram essa incerteza. Considere o checklist seguinte:
    
- Você está executando ferramentas de cobertura? Você checa se cada if e while estão cobertos? 
- A cobertura de testes unitários é próxima de 100%? 
- Você precisa aumentar um pouco a cobertura escrevendo mais testes?
- Você tem testes de aceitação automatizados escritos por (ou pelo menos validados por) pessoas de negócio e Garantia de Qualidade? 
- A cobertura de testes é alta o suficiente? Você precisa aumenta-la um pouco pedindo para a GQ considerar mais alguns casos extremos?
- Você tem testes de integração automatizados escritos por arquitetos e desenvolvedores líderes? 
- Esses testes estressam os caminhos de comunicação entre os componentes? 
- Eles checam por casos excepctionais, problemas nos limites e timeouts? 
- Eles examinam o comportamento do sistema sob cargas variáveis?    
- Se você tem múltiplas threads, você tem uma estratégia para estressar essas threads durante seus testes unitários e testes de aceitação? 
- Por exemplo, você implementou ferramentas que introduzem delays aleatórios e cargas aleatórios para que as probabilidades de condições de corrida sejam aumentadas? 
- Melhor ainda, você está gradualmente eliminando a possbilidade de condições de corrida por meio da eliminação de estados mutáveis entre threads? Você desenhou todos os diagramas de sequência de mensagens e os examinou em busca de corridas em potencial?

Esse checklist é só um exemplo. Eu tenho certeza que você consegue pensar em mais coisas para acrescentar. O ponto é que é melhor ser proativo a respeito da sua incerteza, do que ser passivo a respeito dela. E fases de estabilização são passivas.

O objetivo de equipes de software que estão atualmente usando fases de estabilização deveria ser aumentar sua confiança com o tempo, e dessa forma reduzir a duração de suas fases de estabilização. Reduza de um mês, para uma semana. Então de uma semana para um dia. Então de um dia para uma hora.

E então, finalmente, aumenta sua confiança ao ponto de poder eliminar a fase de estabilização de uma vez por todas.

Uma historinha:
    
Eu recentemente fiz um test-drive com uma Tesla. É um carro divertido de se dirigir. Realmente divertido. 
Eu testei a funcionalidade de piloto automático, que é facilmente ativada apertando um botão na coluna de direção. 
O carro alegremente lhe informa que a partir de agora está dirigindo a si mesmo; e lhe alerta para manter as mãos no volante. Preste atenção nesse aviso!	

O carro se saiu razoavelmente bem quando as marcas na estrada eram visíveis, mas parecia bastante disposto a me arrebentar em algumas barragens de construção. Não é seguro tirar suas mãos do volante ou seus olhos da pista. Para mim, isso torna a funcionalidade menos que inútil.

O vendedor estava sentado do meu lado. Em um certo momento nós estávamos indo a 70 km/h em direção à traseira de um carro parado no sinal fechado. O vendedor disse: "Confie no carro." E eu pensei: "Até parece!" E **eu** freei o carro. 
A tecnologia é interessante; mas perigosa. NUNCA "confie no carro"!
        
Talvez você tenha percebido que a perspectiva de carros autônomos não me enche de entusiasmo. Eu vou continuar pensando o que será que esses carros farão um segundo após 29 de fevereiro.
