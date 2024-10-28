interface ICalculateCardStyleParams {
    index: number;
    hoveredCardIndex?: number;
    totalCards: number,
    bottomPosition: boolean;
}

export const calculateCardStyle = ({
    index,
    hoveredCardIndex,
    totalCards,
    bottomPosition,
}: ICalculateCardStyleParams) => {
    let middle = (totalCards / 2);
    middle = middle % 2 ? middle - .5 : middle;
    const offset = 2;
    const translateOffsetX = 10;
    const translateOffsetY = 3;
    let rotate = 0;
    let translateX = 0;
    let translateY = 5;

    if (index < middle) {
      rotate = (index - middle) * offset;
      translateX = (index - middle) * translateOffsetX;
      translateY = translateOffsetY * (middle - index);
    } else if (index > middle) {
      rotate = (index - middle) * offset;
      translateX = (index - middle) * translateOffsetX;
      translateY = translateOffsetY * (index - middle);
    }

    if (hoveredCardIndex === index) {
        translateY = -52;
        rotate = 0;
    }

    return {
      transform: `translateX(${translateX}%) translateY(${translateY}%) rotate(${rotate}deg)`,
    };
};
