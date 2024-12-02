interface ICalculateCardStyleParams {
    dragging?: boolean;
    hoveredCardIndex?: number;
    index: number;
    playerPosition?: string;
    selected?: boolean;
    totalCards: number,
}

export const calculateCardStyle = ({
    hoveredCardIndex,
    index,
    totalCards,
    selected,
}: ICalculateCardStyleParams) => {
    let middle = (totalCards / 2);
    middle = middle % 2 ? middle - .5 : middle;
    const offset = 2;
    const translateOffsetY = 3;
    let rotate = 0;
    let translateY = 0;

    if (index < middle) {
      rotate = (index - middle) * offset;
      translateY = translateOffsetY * (middle - index);
    } else if (index > middle) {
      rotate = (index - middle) * offset;
      translateY = translateOffsetY * (index - middle);
    }

    if (hoveredCardIndex === index) {
        translateY = -62;
        rotate = 0;
    } else if (selected && totalCards > 1) {
        translateY -= 10;
    }

    return {
      transform: `translateY(${translateY}%) rotate(${rotate}deg)`,
      transformOrigin: 'center'
    };
};
