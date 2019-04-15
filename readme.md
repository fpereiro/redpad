# redpad

redpad is a tool that takes a text and generates an HTML which contains an interlined translation of the text.

## Why?

It would be cool to read classics in the original language. And reading in a language you don't know is a time-tested (yet currently unconventional) way of learning the language itself.

But reading originals in a language that you don't know well can be a pain when you need to look up a word. Especially in a tablet.

It would be nice to have the translation in the text itself, but only when I need them. Other qualities of an ideal interlined book are:

- Make the translation appear and disappear when I want, by just tapping on the screen.
- Have pages, so it's easy to scroll.
- The translations should be longer than a word and shorter than a sentence.
- The book should be accessible while offline.
- The book should be responsive and useful on tablets and phones.

## How does this look like?

Redpad is an HTML file that dynamically accesses a library of books in redpad format. This HTML file is, essentially, a reader.

- *[Gerusalemme Liberata](https://unpkg.com/redpad@2.0.0/redpad.html)* (Jerusalem Delivered), by Torcuato Tasso.

The following public domain books are available, translated to English:

- *[Игрок](https://unpkg.com/redpad@2.0.0/ru/igrok-en.html)* (The Gambler), by Feodor Dostoievski.

- Tome 1 of *[Война и мир](https://unpkg.com/redpad@2.0.0/ru/voina-1-en.html)* (War and Peace), by Lev Tolstoy

- *[Voyage au Centre de la Terre](https://unpkg.com/redpad@2.0.0/fr/voyage-en.html)* (Journey to the Center of the Earth), by Jules Verne.

- *[Gerusalemme Liberata](https://unpkg.com/redpad@2.0.0/it/gerusalemme-en.html)* (Jerusalem Delivered), by Torcuato Tasso.

All files are hosted by courtesy of [Unpkg](https://unpkg.com).

## But the translations are not correct! Isn't this misleading?

I know, I know. But they are good enough, at least for me. Not only they are available right now with minimal human effort, but I think that their imperfection stimulates the need for understanding the original.

## How?

The process is quite straightforward:

- We start with a .txt file which contains the text to be translated.
- We split it into parts (the technical term for this is `tokenizing`).
- We use the amazing [Yandex translation API](https://tech.yandex.com) to translate each token and generate a JSON file containing each token and its translation.
- We dynamically fetch the JSON file with book content into an HTML reader.

## Installation

To run redpad:

- Install node.js.
- Run `npm i redpad`.
- [Get a Yandex Translate API key](https://tech.yandex.com/keys/get/?service=trnsl).
- Place it in a file named `config.js`, which should have the following form:

```javascript
module.exports = {
   key: YOUR_YANDEX_API_KEY
}
```

## Todo

- Add pairs until the page is full.
- Split tokens by words if they don't fit in line (also translations).
- Store last position per book.

## Usage

To take a text file and generate a JSON file where the translations will be placed: `node redpad json TXTFILE JSONFILE`.

To take the json file generated in the previous step and load translations into it: `node redpad translate JSONFILE`. Redpad will start fetching missing translations but leave the previously fetched ones in place. If you wish to cancel the operation, you can enter CTRL+C. Redpad will save all the translations fetched so far into the file.

The json file is an array of arrays. Each of the arrays contains two strings (the original text plus its translation), or a string and a `null` (in case that particular piece of text hasn't been translated yet).

## How can I help?

- Submit text files of books that are uncontestedly in the public domain. If everything looks nice and legal, I will put them here.
- Recommend visual or functional improvements to how we display the book.
- Share it with people that might find it interesting.
- Thank the fine folks at [Github](https://github.com), [Yandex](https://tech.yandex.com/) and [Unpkg](https://unpkg.com) for providing the essential infrastructure for this project.

And if you are crazy enough:

- Improve the translations manually for the books already in this repo (editing the .json files in the repo).

## License

redpad is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
