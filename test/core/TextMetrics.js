'use strict';

/* eslint-disable no-multi-str */
const longText = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem \
accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo \
inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo \
enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia \
consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro \
quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, \
sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam \
quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam \
corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis \
autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil \
molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla \
pariatur?';

const breakingWordText = 'Pixi.js - The HTML5 Creation Engine. Create beautiful \
digital content with the supercalifragilisticexpialidociously fastest, most \
flexible 2D WebGL renderer.';

const fillText = '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .\
. . . . . . . . . . . . . . . . . . . . . . . . ';

const intergityText = '012345678901234567890123456789';

describe('PIXI.TextMetrics', function ()
{
    const defaultStyle = {
        breakWords: true,
        fontFamily: 'Arial',
        fontSize: 20,
        fontStyle: 'italic',
        fontVariant: 'normal',
        fontWeight: 900,
        wordWrap: true,
        wordWrapWidth: 200,
        letterSpacing: 4,
    };

    describe('canBeginLineCJK', function ()
    {
        const falseTests = [
            { character: '\uff02',
                language: PIXI.TextMetrics.CJKLanguage.CHINESE },
            { character: '\u005d',
                language: PIXI.TextMetrics.CJKLanguage.JAPANESE },
            { character: '\uff0e',
                language: PIXI.TextMetrics.CJKLanguage.KOREAN },
        ];

        falseTests.forEach(function (test)
        {
            it(`correctly classifies ${test.character} in language ${test.language} `
                + 'as not allowed at the beginning of line', function ()
            {
                expect(PIXI.TextMetrics.canBeginLineCJK(test.character,
                    test.language)).to.equal(false);
            });
        });

        const trueTests = [
            { character: '(',
                language: PIXI.TextMetrics.CJKLanguage.CHINESE },
            { character: '\n',
                language: PIXI.TextMetrics.CJKLanguage.JAPANESE },
            { character: '\u0025',
                language: PIXI.TextMetrics.CJKLanguage.JAPANESE },
            { character: '\u2048',
                language: PIXI.TextMetrics.CJKLanguage.KOREAN },
            { character: '\u0024',
                language: PIXI.TextMetrics.CJKLanguage.OTHER },
            { character: null,
                language: null },
        ];

        trueTests.forEach(function (test)
        {
            it(`correctly classifies ${test.character} in language ${test.language} `
                + 'as allowed at the beginning of line', function ()
            {
                expect(PIXI.TextMetrics.canBeginLineCJK(test.character,
                    test.language)).to.equal(true);
            });
        });
    });

    describe('canEndLineCJK', function ()
    {
        const falseTests = [
            { character: '\ufe39',
                language: PIXI.TextMetrics.CJKLanguage.CHINESE },
            { character: '\u3008',
                language: PIXI.TextMetrics.CJKLanguage.JAPANESE },
            { character: '\uff08',
                language: PIXI.TextMetrics.CJKLanguage.KOREAN },
        ];

        falseTests.forEach(function (test)
        {
            it(`correctly classifies ${test.character} in language ${test.language} `
                + 'as not allowed at the end of line', function ()
            {
                expect(PIXI.TextMetrics.canEndLineCJK(test.character,
                    test.language)).to.equal(false);
            });
        });

        const trueTests = [
            { character: '\u3018',
                language: PIXI.TextMetrics.CJKLanguage.CHINESE },
            { character: '\n',
                language: PIXI.TextMetrics.CJKLanguage.JAPANESE },
            { character: '\ufe59',
                language: PIXI.TextMetrics.CJKLanguage.JAPANESE },
            { character: '\u00b7',
                language: PIXI.TextMetrics.CJKLanguage.KOREAN },
            { character: '\u0024',
                language: PIXI.TextMetrics.CJKLanguage.OTHER },
            { character: null,
                language: null },
        ];

        trueTests.forEach(function (test)
        {
            it(`correctly classifies ${test.character} in language ${test.language} `
                + 'as allowed at the end of line', function ()
            {
                expect(PIXI.TextMetrics.canEndLineCJK(test.character,
                    test.language)).to.equal(true);
            });
        });
    });
    describe('canBeSplitJapanese', function ()
    {
        const falseTests = [
            { character1: '\u2014',
                character2: '\u2026' },
            { character1: '\u2025',
                character2: '\u3033' },
            { character1: '\u3034',
                character2: '\u3035' },
            { character1: '1',
                character2: '2' },
        ];

        falseTests.forEach(function (test)
        {
            it(`correctly recognizes that ${test.character1} and ${test.character2} `
                + 'cannot be split among lines in Japanese in that order', function ()
            {
                expect(PIXI.TextMetrics.canBeSplitJapanese(test.character1,
                    test.character2)).to.equal(false);
            });
        });

        const trueTests = [
            { character1: '\u2026',
                character2: '\u2014' },
            { character1: '\u3033',
                character2: '\u2025' },
            { character1: '\u3035',
                character2: '\u3034' },
            { character1: '1',
                character2: '\u2026' },
            { character1: '\u2014',
                character2: '2' },
            { character1: null,
                character2: 'a' },
            { character1: 'a',
                character2: null },
            { character1: null,
                character2: undefined },
        ];

        trueTests.forEach(function (test)
        {
            it(`correctly recognizes that ${test.character1} and ${test.character2} `
                + 'can be split among lines in Japanese in that order', function ()
            {
                expect(PIXI.TextMetrics.canBeSplitJapanese(test.character1,
                    test.character2)).to.equal(true);
            });
        });
    });

    describe('CJKTextLanguage', function ()
    {
        const chineseTests = [
            '这是鱼钩。 我们把小鱼爱吃的东西挂在上面。',
            '电脑死机了。',
            '我正在用电脑。',
            '你喜欢红色，蓝色还是黑色？',
        ];

        chineseTests.forEach(function (test)
        {
            it(`correctly identifies ${test} as Chinese text`, function ()
            {
                expect(PIXI.TextMetrics.CJKTextLanguage(test))
                .to.equal(PIXI.TextMetrics.CJKLanguage.CHINESE);
            });
        });

        const japaneseTests = [
            'これ は くるま です。',
            '車は赤いです。',
            'たろう は のりこ を みました。',
            '太郎は私の車を見ました。',
        ];

        japaneseTests.forEach(function (test)
        {
            it(`correctly identifies ${test} as Japanese text`, function ()
            {
                expect(PIXI.TextMetrics.CJKTextLanguage(test))
                .to.equal(PIXI.TextMetrics.CJKLanguage.JAPANESE);
            });
        });

        const koreanTests = [
            '에릭이 사과를 먹어요',
            '별일 없지요 ?',
            '실례지만…',
            '천천히 말해 주세요.',
        ];

        koreanTests.forEach(function (test)
        {
            it(`correctly identifies ${test} as Korean text`, function ()
            {
                expect(PIXI.TextMetrics.CJKTextLanguage(test))
                .to.equal(PIXI.TextMetrics.CJKLanguage.KOREAN);
            });
        });

        const otherTests = [
            'Hello, how are you?',
            'Je n\'ai pas fini mon dîner',
            'يعمل جدّي في التجارة.',
            'Как вас зовут?',
        ];

        otherTests.forEach(function (test)
        {
            it(`correctly identifies ${test} as non-CJK text`, function ()
            {
                expect(PIXI.TextMetrics.CJKTextLanguage(test))
                .to.equal(PIXI.TextMetrics.CJKLanguage.OTHER);
            });
        });
    });

    describe('wordWrap without breakWords', function ()
    {
        it('width should not be greater than wordWrapWidth with longText', function ()
        {
            const style = Object.assign({}, defaultStyle, { breakWords: false });

            const metrics = PIXI.TextMetrics.measureText(longText, new PIXI.TextStyle(style));

            expect(metrics.width).to.be.below(style.wordWrapWidth);

            metrics.lines.forEach((line) =>
            {
                expect(line[0]).to.not.equal(' ', 'should not have space at the start');
                expect(line[line - 1]).to.not.equal(' ', 'should not have space at the end');
            });
        });

        it('width should be greater than wordWrapWidth with breakingWordText', function ()
        {
            const style = Object.assign({}, defaultStyle, { breakWords: false });

            const metrics = PIXI.TextMetrics.measureText(breakingWordText, new PIXI.TextStyle(style));

            expect(metrics.width).to.be.above(style.wordWrapWidth);

            metrics.lines.forEach((line) =>
            {
                expect(line[0]).to.not.equal(' ', 'should not have space at the start');
                expect(line[line - 1]).to.not.equal(' ', 'should not have space at the end');
            });
        });

        it('width should be within a character width from wordWrapWidth with fillText', function ()
        {
            const charWidth = 4; // it should fill the line to at lease width -4

            const style = Object.assign({}, defaultStyle, { breakWords: false });

            const metrics = PIXI.TextMetrics.measureText(fillText, new PIXI.TextStyle(style));

            expect(metrics.width).to.be.below(style.wordWrapWidth);
            expect(metrics.width + charWidth).to.be.above(style.wordWrapWidth);

            metrics.lines.forEach((line) =>
            {
                expect(line[0]).to.not.equal(' ', 'should not have space at the start');
                expect(line[line - 1]).to.not.equal(' ', 'should not have space at the end');
            });
        });
    });

    describe('wordWrap with breakWords', function ()
    {
        it('width should not be greater than wordWrapWidth with longText', function ()
        {
            const style = Object.assign({}, defaultStyle, { breakWords: true });

            const metrics = PIXI.TextMetrics.measureText(longText, new PIXI.TextStyle(style));

            expect(metrics.width).to.be.below(style.wordWrapWidth);

            metrics.lines.forEach((line) =>
            {
                expect(line[0]).to.not.equal(' ', 'should not have space at the start');
                expect(line[line - 1]).to.not.equal(' ', 'should not have space at the end');
            });
        });

        it('width should not be greater than wordWrapWidth with breakingWordAtStartText', function ()
        {
            const style = Object.assign({}, defaultStyle, { breakWords: true });

            const metrics = PIXI.TextMetrics.measureText(breakingWordText, new PIXI.TextStyle(style));

            expect(metrics.width).to.be.below(style.wordWrapWidth);

            metrics.lines.forEach((line) =>
            {
                expect(line[0]).to.not.equal(' ', 'should not have space at the start');
                expect(line[line - 1]).to.not.equal(' ', 'should not have space at the end');
            });
        });

        it('width should be within a character width from wordWrapWidth with fillText', function ()
        {
            const charWidth = 4; // it should fill the line to at lease width -4

            const style = Object.assign({}, defaultStyle, { breakWords: true });

            const metrics = PIXI.TextMetrics.measureText(fillText, new PIXI.TextStyle(style));

            expect(metrics.width).to.be.below(style.wordWrapWidth);
            expect(metrics.width + charWidth).to.be.above(style.wordWrapWidth);

            metrics.lines.forEach((line) =>
            {
                expect(line[0]).to.not.equal(' ', 'should not have space at the start');
                expect(line[line - 1]).to.not.equal(' ', 'should not have space at the end');
            });
        });

        it('no words or characters should lost or changed', function ()
        {
            const style = Object.assign({}, defaultStyle, { breakWords: true });

            const metrics = PIXI.TextMetrics.measureText(intergityText, new PIXI.TextStyle(style));

            const lines = metrics.lines.reduce((accumulator, line) => accumulator + line);

            expect(lines).to.equal(intergityText, 'should have the same chars as the original text');
        });
    });
});
