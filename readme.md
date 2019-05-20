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

This is a link to the [latest version](https://unpkg.com/redpad@2.3.0/redpad.html).

The following public domain books are available, translated to English:

- *Игрок* (The Gambler), by Feodor Dostoievski.

- Tome 1 of *Война и мир* (War and Peace), by Lev Tolstoy.

- *Капитанская дочка* (The Captain's Daughter), by Feodor Dostoievski.

- *Voyage au Centre de la Terre* (Journey to the Center of the Earth), by Jules Verne.

- *Gerusalemme Liberata* (Jerusalem Delivered), by Torcuato Tasso.

The full list is [here](https://github.com/fpereiro/redpad/tree/master/books).

All files are hosted by courtesy of [Unpkg](https://unpkg.com) and [jsDelivr](https://www.jsdelivr.com/).

## But the translations are not correct! Isn't this misleading?

I know, I know. But they are good enough, at least for me. Not only they are available right now with minimal human effort, but I think that their imperfection stimulates the need for understanding the original.

## How?

The process is quite straightforward:

- We start with a .txt file which contains the text to be translated.
- We split it into parts (the technical term for this is `tokenizing`).
- We use the amazing [Yandex translation API](https://tech.yandex.com) to translate each token and generate a JSON file containing each token and its translation.
- We dynamically fetch the JSON file with book content into an HTML reader.

## Redpad format

It consists of a JSON array made of arrays, each of them with two elements. The first element of each array is a string with a fragment of the original text; the second element is either another string (with its translation) or `null` (if the translation is still pending).

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

- Improve the translations manually for the books already in this repo (editing the JSON files in the [books folder of the repo](https://github.com/fpereiro/redpad/tree/master/books)).

## License

redpad is written by Federico Pereiro (fpereiro@gmail.com) and released into the public domain.
