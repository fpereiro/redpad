# redpad

redpad is a tool that takes a text and generates an HTML which contains an interlined translation of the text.

## Why?

It would be cool to read classics in the original language. And reading in a language you don't know is a time-tested (yet currently unconventional) way of learning the language itself.

But reading originals in a language that you don't know well can be a pain when you need to look up a word. Especially in a tablet.

It would be nice to have the translation in the text itself. Here's things that would make it extra nicer:

- Appear and disappear when I want, at the touch of a button.
- Have pages, so it's easy to scroll.
- The translations should be longer than a word and shorter than a sentence.
- Be accessible while offline.
- Be responsive and useful on tablets and phones.

## How does this look like?

Here's an English version of *[Игрок](https://cdn.rawgit.com/fpereiro/redpad/f19400b60e267b9c28c1f60f5509bd6f926056c4/ru/igrok-en.html)* (The Gambler), by Feodor Dostoievski.

And here's an English version of *[Voyage au Centre de la Terre](https://cdn.rawgit.com/fpereiro/redpad/f19400b60e267b9c28c1f60f5509bd6f926056c4/fr/voyage-en.html)* (Journey to the Center of the Earth), by Jules Verne.

Both files are hosted by courtesy of [RawGit](https://rawgit.com) and [MaxCDN](https://maxcdn.com).

## But the translations are not correct! Isn't this misleading?

I know, I know. But they are good enough, at least for me. Not only they are available right now with minimal human effort, but I think that their imperfection stimulates the need for understanding the original.

## How?

The process is quite straightforward:

- We start with a .txt file which contains the text to be translated.
- We split it into parts (the technical term for this is `tokenizing`).
- We use the amazing [Yandex translation API](https://tech.yandex.com) to translate each token and generate a JSON file containing each token and its translation.
- We create a self-contained HTML web page which contains the JSON file above, plus a little bit of code and markup.

## Installation

To run redpad, you will need:

- node.js.
- `npm i redpad`.
- [Get a Yandex Translate API key](https://tech.yandex.com/keys/get/?service=trnsl).
- Place it in a file named `config.js`, which should have the following form:

```javascript
module.exports = {
   key: YOUR_YANDEX_API_KEY
}
```

## Usage

- `node redpad SOURCE_FILE OPERATION TARGET_LANGUAGE`
- `SOURCE_FILE` must be a path to an UTF-8 encoded text file, with an extension that doesn't finish in `.json` or `.html` and that has a length of either three or four characters.
- `OPERATION` can be either `json` (for generating the `.json` file using the Yandex API), `html` (for generating the `.html` from a preexisting `.json` file) or `both` (for doing first the `.json` and then the `.html`).
- `LANGUAGE` is the **target** language of your translation, by default English.

For example, running `node redpad fr/voyage.txt json` and then `node redpad fr/voyage.txt html` will generate the same result than running `node redpad fr/voyage.txt both` once.

## How can I help?

- Submit .txts of books that are uncontestedly in the public domain. Even better, submit .txts and their corresponding .jsons and .htmls. If everything looks nice and legal, I will put them here.
- Recommend visual or functional improvements to how we display the book.
- Share it with people that might find it interesting.
- Thank the fine folks at [Github](https://github.com), [Yandex](https://tech.yandex.com/) and [MaxCDN](https://maxcdn.com) for providing the essential infrastructure for this project.

And if you are crazy enough:

- Improve the translations manually for the books alrady in this repo (editing the .json files in the repo).

## License

redpad is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
