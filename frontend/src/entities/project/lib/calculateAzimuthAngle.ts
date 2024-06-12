export function calculateAzimuthAngle(tiltX: number, tiltY: number): number {
    // Convert tiltX and tiltY from degrees to radians
    const tiltXRad = tiltX * (Math.PI / 180);
    const tiltYRad = tiltY * (Math.PI / 180);

    // Calculate the sine of the tilt angles
    const sinTiltX = Math.sin(tiltXRad);
    const sinTiltY = Math.sin(tiltYRad);

    // Calculate the azimuth angle
    let azimuthAngle = Math.atan2(sinTiltX, sinTiltY);

    // Ensure the azimuthAngle is within 0 to 2*PI range
    if (azimuthAngle < 0) {
        azimuthAngle += 2 * Math.PI;
    }

    return azimuthAngle;
}
