title = document.querySelector("div.title")
title.innerText = "[GS-1-01] 発表タイトル"

date = document.querySelector("p.dateplace > span:nth-child(1)")
date.innerText = "2024年6月8日(土) 13:30 〜 15:10"

place = document.querySelector("p.dateplace > span:nth-child(2)")
place.innerText = "A会場"

title = document.querySelector("#ev-sbjct > div > section > div > div.title-sbject-style > h1")
title.innerText = " [GS-1] 基礎・理論："

personals = document.querySelector("p.personals.personals")
personals.innerText = ""

author = document.querySelector("p.personals.author")
author.innerHTML = `
<span title="発表者">発表者<sup>1</sup></span>
<span title="所属">(1. 〇〇大学)</span>
`

kw = document.querySelector("p.keyword")
kw.innerText = "キーワード：機械学習"

outline = document.querySelector("div.outline")
outline.innerText = "Abstract"
