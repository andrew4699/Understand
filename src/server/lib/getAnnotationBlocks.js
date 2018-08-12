const {isAWord} = require("./utils");

function getPageBlocks(page)
{
    let blocks = [];

    for(let i = 0; i < page.blocks.length; i++)
    {
        let block =
        {
            text: getBlockText(page.blocks[i]),
            bounds: page.blocks[i].boundingBox.vertices
        };

        blocks.push(block);
    }

    return blocks;
}

function getBlockText(block)
{
    let text = "";

    for(let i = 0; i < block.paragraphs.length; i++)
    {
        text += getParagraphText(block.paragraphs[i]);
    }

    return text;
}

function getParagraphText(prph)
{
    let text = "", nextWord;

    for(let i = 0; i < prph.words.length; i++)
    {
        if(i > 0)
        {
            text += " ";
        }
        
        let word;

        // if we already got the nextWord, use it instead of calculating it again
        if(nextWord)
        {
            word = nextWord;
            nextWord = undefined;
        }
        else
        {
            word = getWordText(prph.words[i]);
        }

        const lastChar = word.charAt(word.length - 1);

        // turn hyphen-split words into 1
        if(lastChar === "-" && i < prph.words.length - 1 && !isAWord(word))
        {
            nextWord = getWordText(prph.words[i + 1]);

            if(isAWord(nextWord))
            {
                word = word.slice(0, -1) + nextWord; // remove hyphen, add next word
                nextWord = undefined; // we already used nextWord
                i++; // skip the next word
            }
        }

        text += word;
    }

    return text;
}

function getWordText(word)
{
    let text = "";

    for(let i = 0; i < word.symbols.length; i++)
    {
        text += word.symbols[i].text;
    }

    return text;
}

module.exports = function(ann)
{
    let blocks = [];

    for(let i = 0; i < ann.pages.length; i++)
    {
        let pageBlocks = getPageBlocks(ann.pages[i]);
        blocks.push.apply(blocks, pageBlocks); // merge arrays
    }

    return blocks;
};