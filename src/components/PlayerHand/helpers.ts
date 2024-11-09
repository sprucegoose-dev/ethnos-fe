interface ICalculateCardStyleParams {
    dragging?: boolean;
    hoveredCardIndex?: number;
    index: number;
    playerPosition?: string;
    totalCards: number,
}

export const calculateCardStyle = ({
    hoveredCardIndex,
    index,
    totalCards,
    playerPosition
}: ICalculateCardStyleParams) => {
    let middle = (totalCards / 2);
    middle = middle % 2 ? middle - .5 : middle;
    const offset = 2;
    const translateOffsetX = playerPosition === 'bottom' ? 20 : 15;
    const translateOffsetY = 3;
    let rotate = 0;
    let translateX = 0;
    let translateY = 0;

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
        translateY = -61.5;
        rotate = 0;
    }

    return {
      transform: `translateX(${translateX}%) translateY(${translateY}%) rotate(${rotate}deg)`,
      transformOrigin: 'center'
    };
};
