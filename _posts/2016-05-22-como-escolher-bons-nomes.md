---
title: Dez dicas para lhe ajudar a escolher bons nomes
permalink: /pt/como-escolher-bons-nomes/
lang: pt
ref: howtonamethings
layout: post
author: Carlos Schults
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1462225938/baby-name-min_nosetz.png
tags:
- boas-praticas
- legibilidade
---

![](https://res.cloudinary.com/dz5ppacuo/image/upload/v1462225938/baby-name-min_nosetz.png)

> Só existem duas coisas difíceis em Ciência da Computação: invalidação de cache e escolher nomes das coisas.
> 
> Phil Karlton

Você quer escrever um código muito bom? Código limpo, entendível, legível? Existem várias habilidades que você precisa adquirir. Mas eu diria que no topo da lista está "Escolher bons nomes".
<!--more-->

Escolher ótimos nomes para suas classes, métodos, variáveis e demais coisas do tipo é essencial. Um nome bem escolhido muitas vezes é a diferença entre código bom e horrível.

Mas o que é exatamente um bom nome? Apesar de existirem algumas diretrizes bem aceitas, eu devo dizer que não existe exatamente um consenso. (E é assim com muitos tópicos em nossa área, eu diria).

Então, hoje eu vou falar sobre algumas convenções e princípios que eu uso quando estou codificando. É meio que uma mistura do que eu aprendi na faculdade, estudando por conta própria e trabalhando como um desenvolvedor profissional. Essas convenções e princípios têm sido úteis para mim, então eu espero que sejam úteis para você também.

Algumas das dicas que vou mostrar vêm do livro "Código Limpo", escrito por Robert C. Martin (mais conhecido com Uncle Bob). É um dos meus livros de programação favoritos, e eu escreverei uma resenha dele em breve. Fique ligado!

## 0. Use nomes auto-explicativos

O quê sua variável/classe/sei-lá-o-quê faz? Como ela deve ser usada? Escolha um nome que responda a essas perguntas.

Algumas pessoas têm essa ideia esquisita de que nomes mais curtos são sempre melhores. Eu não entendo isso. Elas estão tentando economizar o teclado ou algo assim?

Digamos que ao ler um código você se depara com isso:

{% highlight c# %}
    int d; // dias para fim do prazo
{% endhighlight %}

Você poderia argumentar que o código está bom assim. O significado da variável está perfeitamento expresso no comentário. Ótimo, mas lembre-se que a variável vai provavelmente ser utilizada em outros pontos, longe da declaração e do comentário.

Então...não seria melhor se livrar do comentário e usar o texto do comentário como o nome da variável?

{% highlight c# %}
    int diasParaFimDoPrazo;
{% endhighlight %}

## 1. Use abreviações apenas quando elas são amplamente conhecidas

Seria loucura nomear uma variável "UniformeResourceLocatorServico" em vez de "UrlServico". Qualquer desenvolvedor sabe o que uma url é. A mesma coisa com Ftp, UI, IO, e por aí vai. Ou seja, tudo bem usar abreviações nos seus nomes, mas só quando elas são bem conhecidas. Seria contra-produtivo não fazer assim.

A propósito. Quando eu digo "amplamente conhecidas", não estou querendo dizer conhecidas no mundo todo, ou mesmo no país todo. É claro que você pode e deve usar abreviações que são comuns no domínio do seu negócio. Em geral é considerado uma boa prática codificar o mais próximo possível da linguagem do cliente. Então, se os outros desenvolvedores e as pessoas de negócio se sentem confortáveis usando as abreviações, não tem problema nenhum utilizá-las.

## 2. Escolha clareza ao invés de brevidade

Isso é parecido com o primeiro ponto. Todo o resto se mantendo igual, nomes mais curtos são melhores. Mas um dia você terá que escolher entre clareza e brevidade. Quando esse dia chegar, escolha a clareza. Seis meses depois, quando você tiver que revisitar aquele código, você vai agradecer a si mesmo.

## 3. Use convenções amplamente aceitas (na maior parte do tempo

Existem poucos pontos no livro "Código Limpo" com os quais eu não concordo. Um deles é a recomendação do Uncle Bob para não começar nomes de interfaces com uma letra "I" maiúscula. Ele argumenta que essa prática é um resquício da Notação Húngara e portanto deveria desaparecer. Mesmo eu entendendo a porque ele pensa dessa forma, vou continuar a nomear minhas interfaces com um "I" no começo.

Por que? A razão é muito simples: essa é uma convenção bem aceita e utilizada na comunidade .Net. Quando você vai contra uma convenção estabelecida, você corre o risco de alienar desenvolvedores que estão acostumados com essa convenção, como potenciais novos membros da equipe ou contribuidores de projetos open-source.

A minha opinião é que se deve abandonar uma convenção extremamente bem aceita apenas quando os benefícios de fazer isso são muito maiores que os custos. E eu não acredito que esse seja o caso aqui.

## 4. Não use notação húngara

Talvez você tenha ouvido falar de notação húngara, talvez não. Mas eu aposto que você já viu, ou talvez já tenha até mesmo usado, mesmo que o nome não seja familiar.

Então, o que é essa notação? Nossa amiga Wikipédia veio dar uma mãozinha aqui:

> Notação húngara é uma convenção de nomeação de identificadores em programação de computadores, na qual o nome de uma variável ou função indica seu tipo ou uso pretendido.
>  
>  [Wikipedia: Hungarian Notation, em tradução livre](https://en.wikipedia.org/wiki/Hungarian_notation)


Em resumo, notação húngara é colocar o tipo da variável no seu nome. Se eu tenho uma variável do tipo `int`, que vou usar pra guardar a idade de um estudante, eu poderia nomeá-la  `iIdadeEstudante` ou `intIdadeEstudante`. Do mesmo modo, uma variável string que armaze a descrição de um produto poderia ser chamada `sDescricaoProduto`, ou até mesmo `strDescricaoProduto`.

E por que isso é ruim? Aqui estão algumas razões: 

- Primeiro, é inútil. Se a sua variável tem um nome auto-explicativo (veja item #0), ela já vai te dar uma boa noção do seu tipo. Se você acha uma variável chamada "nomeProduto", você acharia que ela é um número de ponto flutuante? Além disso, a maioria das IDEs modernas conseguem te mostrar não apenas o tipo da variável, mas também se ela é uma variável local, membro de instância ou parâmetro de método, e até quantas vezes ele foi referenciada no código da aplicação.
- Pode causar confusões. Pessoas cometem erros, e é perfeitamente possível mudar o tipo da variável e esquecer de mudar o nome. Então agora você tem uma variável que o nome começa com "int", mas ela é na verdade um `long`.
- Faz com que os nomes fiquem mais difíceis de pronunciar, e isso pode dificultar discussões sobre o código e a arquitetura da sua aplicação.

## 5. Respeite o estilo de codificação da linguagem, framework, ou projeto 

Desenvolvedores C# tendem a utilizar `CamelCase` para nomear variáveis locais, membros de instância e parâmetros de métodos, como em `nomeProduto`. Já em Ruby o estilo recomendado é o `snake_case`. A mesma variável ficaria: `nome_produto`. 

Frameworks, bibliotecas e projetos open-source podem ter suas próprias diretrizes e padrões também.

Seria bobagem lutar contra padrões estabelecidos, por causa do seu próprio gosto e preferência. Se você está desenvolvendo em Ruby, escreva da maneira que a comunidade Ruby espera. O mesmo vale pra Java, C#, PHP, qualquer linguagem/ecossistema.

É como diz o ditado: "Quando estiver em Roma, faça como os romanos".

## 6. Nomes de métodos devem começar com um verbo

Essa dica é bem curta. Métodos são geralmente ações que um objeto pode realizar. Assim, seus nomes deveriam começar com um verbo que indica qual é essa ação, e.g. `ImprimirRelatorio()`, `ExibirPoligono(IPoligono poligono)`.

## 7. Nomes de classes devem ser substantivos

Da mesma forma, nomes de classes deveriam ser substantivos, como `Produto`, `Cliente`, `Estudante`, e assim por diante. Tente evitar termos genéricos como `Manager`, porque eles não adicionam nenhum valor. 

## 8. Nomes de propriedades devem ser substantivos, adjetivos ou frases adjetivas

Propriedades devem ser nomeadas com substantivos (`Nome`), frases adjetivas ou adjetivos (como no caso de propriedades do tipo `Boolean`, e.g. `Finalizado` ou `EstaFinalizado`). 

Ainda com relação a propriedades booleanas, você pode usar os prefixos `Is`, `Can` ou `Get`, caso isso facilite o entendimento da propriedade.

Abrindo um parênteses. Aqui entramos mais uma vez [naquela velha discussão sobre português x inglês]((https://carlosschults.net/pt/programar-portugues-ou-ingles/)). Muita gente vai dizer que misturar português e inglês como em `IsValido` é algo horrível e que jamais deveria ser feito. Outros vão argumentar que o uso de `Is` é um idioma facilmente reconhecível por qualquer programador e que tentar aportuguesá-lo como em `EValido` ou `EhValido` é bem pior. É uma discussão que dá pano pra manga. [Clique aqui para saber minha opinião a respeito.](https://carlosschults.net/pt/programar-portugues-ou-ingles/)

## 9. Use nomes pronunciáveis e passíveis de busca

Se esforce para escolher nomes que são pronunciáveis. Quando você escolhe um nome que é difícil ou impossível de ser pronunciado, você desencoraja a discussão sobre o código, o que nunca é uma boa coisa.

Do mesmo jeito, evite nomes com uma letra só. Entre outras razões, você vai sofrer bastante quando tiver que fazer uma busca por eles! Nomes de uma letra só são bons apenas para variáveis de controle em laços de repetição e em expressões lambda. E ainda assim, só quando o escopo é bem curto.

## Conclusão

Escolher nomes não é uma tarefa fácil. Um nome precisa expressar propósito, intenção, significado. Ele não precisa ser necessariamente "esperto", mas tem situações na qual um pouco de esperteza vai ser necessário.

Um nome deveria expressar claramente o propósito da entidade nomeada. Mas existem coisas que são muito complexas por sua própria natureza, o que torna difícil encontrar um nome que expressa seu propósito de forma simples e clara.

Às vezes, a dificuldade que você tem ao escolher um nome é sintomas de outro problema, tal como uma arquitetura ruim. Se você não consegue se decidir entre cinco possíveis nomes para uma classe, talvez ela esteja violando o Princípio da Responsabilidade Única (ela está tentando fazer mais de uma coisa).

Por outro lado, se você se sente inclinado a nomear uma dúzia de classes com o mesmo nome...talvez elas deveriam ser uma classe só.

No fim das contas, escolha de nomes tem a ver com comunicação. E eu acho que é por isso que é uma tarefa tão difícil. Convenhamos: nós, desenvolvedores de software, não somos famosos por nossas habilidades de comunicação.

Em "Código Limpo", no final do capítulo sobre escolher bons nomes, Uncle Bob fala:

> O mais difícil sobre escolher bons nomes é a necessidade de se possuir boas habilidades de descrição e um histórico cultural compartilhado. Essa é uma questão de aprender, e não técnica, gerencial ou empresarial. Como consequência, muitas pessoas nessa área não aprendem essa tarefa muito bem.

Não seja igual a maioria das pessoas na nossa área. Trabalhe dure para aprender a criar bons nomes. Você vai se agradecer no futuro.
