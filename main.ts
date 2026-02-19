namespace SpriteKind {
    export const TrashBag = SpriteKind.create()
    export const TrashCan = SpriteKind.create()
    export const Flag = SpriteKind.create()
    export const MovingPlatform = SpriteKind.create()
    export const Hazard = SpriteKind.create()
}
/**
 * Arrays to track starting positions of moving platforms
 */
// Win condition when touching flag
sprites.onOverlap(SpriteKind.Player, SpriteKind.Flag, function (sprite, otherSprite) {
    if (info.score() >= 50) {
        game.splash("You cleaned up the park!", "Final Score: " + info.score())
        game.over(true, effects.confetti)
    } else {
        game.splash("Collect more trash first!", "Need 50 points to win")
    }
})
// Jump control with double jump
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (playerOnGround) {
        mySprite.vy = -180
        jumpsLeft = 1
        music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
    } else if (jumpsLeft > 0) {
        mySprite.vy = -160
        jumpsLeft += -1
        effects.starField.startScreenEffect(100)
        music.play(music.melodyPlayable(music.jumpUp), music.PlaybackMode.InBackground)
    }
})
// Helper function to add platform with tracking
function createMovingPlatform (img2: Image, x: number, y: number, vx: number, vy: number) {
    movingPlatform = sprites.create(img2, SpriteKind.MovingPlatform)
    movingPlatform.setPosition(x, y)
    movingPlatform.vx = vx
    movingPlatform.vy = vy
    platforms.push(movingPlatform)
    movingPlatforms.push(movingPlatform)
    // Track starting position using parallel arrays
    platformStartX.push(x)
    platformStartY.push(y)
}
// Collision handlers
sprites.onOverlap(SpriteKind.Player, SpriteKind.TrashBag, function (sprite, otherSprite) {
    otherSprite.destroy()
    info.changeScoreBy(5)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.TrashCan, function (sprite, otherSprite) {
    if (info.score() >= 20) {
        otherSprite.destroy()
        info.changeScoreBy(25)
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
        effects.confetti.startScreenEffect(500)
    } else {
        game.splash("Need 20 points!", "Collect more trash bags first")
    }
})
// Hazard collision
sprites.onOverlap(SpriteKind.Player, SpriteKind.Hazard, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    music.play(music.melodyPlayable(music.smallCrash), music.PlaybackMode.InBackground)
    mySprite.setPosition(0, 100)
    mySprite.vy = 0
    mySprite.vx = 0
    scene.cameraFollowSprite(mySprite)
})
let startY = 0
let startX = 0
let mp2: Sprite = null
let verticalRange = 0
let movementRange = 0
let platformStartY: number[] = []
let platformStartX: number[] = []
let movingPlatforms: Sprite[] = []
let movingPlatform: Sprite = null
let jumpsLeft = 0
let playerOnGround = false
let hazard: Sprite = null
let trashCan: Sprite = null
let trashBag: Sprite = null
let platform2: Sprite = null
let platforms: Sprite[] = []
let platform: Sprite = null
let location: tiles.Location = null
let mySprite: Sprite = null
// Create player with upgraded sprite
mySprite = sprites.create(img`
    . . . . . . f f f f . . . . . . 
    . . . . f f f 7 7 f f f . . . . 
    . . . f f f 7 7 7 7 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f f e 7 7 7 7 7 7 e e f . . 
    . . f e 7 f f f f f f 7 e f . . 
    . . f f f f e e e e f f f f . . 
    . f f e f b f 4 4 f b f e f f . 
    . f e e 4 1 f d d f 1 4 e e f . 
    . . f e e d d d d d d e e f . . 
    . . . f e e 4 4 4 4 e e f . . . 
    . . e 4 f 2 2 2 2 2 2 f 4 e . . 
    . . 4 d f 2 2 2 2 2 2 f d 4 . . 
    . . 4 4 f 8 8 5 5 8 8 f 4 4 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . f f . . f f . . . . . 
    `, SpriteKind.Player)
// Player animation
animation.runImageAnimation(
mySprite,
[img`
    . . . . . . f f f f . . . . . . 
    . . . . f f f 7 7 f f f . . . . 
    . . . f f f 7 7 7 7 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f f e 7 7 7 7 7 7 e e f . . 
    . . f e 7 f f f f f f 7 e f . . 
    . . f f f f e e e e f f f f . . 
    . f f e f b f 4 4 f b f e f f . 
    . f e e 4 1 f d d f 1 4 e e f . 
    . . f e e d d d d d d e e f . . 
    . . . f e e 4 4 4 4 e e f . . . 
    . . e 4 f 2 2 2 2 2 2 f 4 e . . 
    . . 4 d f 2 2 2 2 2 2 f d 4 . . 
    . . 4 4 f 8 8 5 5 8 8 f 4 4 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . f f . . f f . . . . . 
    `,img`
    . . . . . . . . . . . . . . . . 
    . . . . . . f f f f . . . . . . 
    . . . . f f f 7 7 f f f . . . . 
    . . . f f f 7 7 7 7 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f f e 7 7 7 7 7 7 e e f . . 
    . f f e 7 f f f f f f 7 e f f . 
    . f f f f f e e e e f f f f f . 
    . . f e f b f 4 4 f b f e f . . 
    . . f e 4 1 f d d f 1 4 e f . . 
    . . . f e 4 d d d d 4 e f e . . 
    . . f e f 2 2 2 2 e d d 4 e . . 
    . . e 4 f 2 2 2 2 e d d e . . . 
    . . . . f 8 8 5 5 f e e . . . . 
    . . . . f f f f f f f . . . . . 
    . . . . f f f . . . . . . . . . 
    `,img`
    . . . . . . f f f f . . . . . . 
    . . . . f f f 7 7 f f f . . . . 
    . . . f f f 7 7 7 7 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f f e 7 7 7 7 7 7 e e f . . 
    . . f e 7 f f f f f f 7 e f . . 
    . . f f f f e e e e f f f f . . 
    . f f e f b f 4 4 f b f e f f . 
    . f e e 4 1 f d d f 1 4 e e f . 
    . . f e e d d d d d d e e f . . 
    . . . f e e 4 4 4 4 e e f . . . 
    . . e 4 f 2 2 2 2 2 2 f 4 e . . 
    . . 4 d f 2 2 2 2 2 2 f d 4 . . 
    . . 4 4 f 8 8 5 5 8 8 f 4 4 . . 
    . . . . . f f f f f f . . . . . 
    . . . . . f f . . f f . . . . . 
    `,img`
    . . . . . . . . . . . . . . . . 
    . . . . . . f f f f . . . . . . 
    . . . . f f f 7 7 f f f . . . . 
    . . . f f f 7 7 7 7 f f f . . . 
    . . f f f e e e e e e f f f . . 
    . . f e e 7 7 7 7 7 7 e f f . . 
    . f f e 7 f f f f f f 7 e f f . 
    . f f f f f e e e e f f f f f . 
    . . f e f b f 4 4 f b f e f . . 
    . . f e 4 1 f d d f 1 4 e f . . 
    . . e f e 4 d d d d 4 e f . . . 
    . . e 4 d d e 2 2 2 2 f e f . . 
    . . . e d d e 2 2 2 2 f 4 e . . 
    . . . . e e f 5 5 8 8 f . . . . 
    . . . . . f f f f f f f . . . . 
    . . . . . . . . . f f f . . . . 
    `],
100,
true
)
controller.moveSprite(mySprite, 100, 0)
mySprite.ay = 350
mySprite.setPosition(0, 124)
scene.cameraFollowSprite(mySprite)
info.setScore(0)
info.setLife(3)
// Set background
scene.setBackgroundColor(9)
// Set up the tilemap
tiles.setCurrentTilemap(tilemap`level1`)
// Platform images
let grassTile = img`
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 d d 7 7 d 7 7 7 7 d 7 7 d d 7 
    7 7 d d d 7 7 d 7 d 7 7 d d 7 7 
    7 7 7 7 7 7 7 7 7 7 d 7 7 7 7 7 
    7 d d 7 7 7 7 7 7 7 7 7 7 d d 7 
    7 7 d 7 7 7 7 7 7 7 7 7 7 d 7 7 
    7 7 7 7 7 7 d 7 7 d 7 7 7 7 7 7 
    7 7 7 d 7 7 7 7 d 7 7 7 d 7 7 7 
    7 d 7 7 7 7 7 7 7 7 7 7 7 7 d 7 
    7 d 7 7 d 7 7 7 7 7 7 d 7 7 d 7 
    7 7 7 7 7 7 7 d 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 d 7 7 7 7 
    7 7 d 7 7 7 7 7 7 7 7 7 7 d 7 7 
    7 7 d d 7 d 7 7 7 7 d 7 d d 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 7 
    `
let platformTile = img`
    e e e e e e e e e e e e e e e e 
    e c c c c c c c c c c c c c c e 
    e c b b b b b b b b b b b b c e 
    e c b d d b b d d b b d d b c e 
    e c b b b b b b b b b b b b c e 
    e c b b d d b b b b d d b b c e 
    e c b b b b b b b b b b b b c e 
    e c b d d b b d d b b d d b c e 
    e c b b b b b b b b b b b b c e 
    e c b b b b d d d d b b b b c e 
    e c b b d d b b b b d d b b c e 
    e c b b b b b b b b b b b b c e 
    e c b d d b b d d b b d d b c e 
    e c b b b b b b b b b b b b c e 
    e c c c c c c c c c c c c c c e 
    e e e e e e e e e e e e e e e e 
    `
let trashBagImage = img`
    . . 1 1 f 1 f 1 1 f 1 f 1 1 . . 
    . . 1 f f d d d d d d f f 1 . . 
    . . 1 f d d d d d d d d f 1 . . 
    . . 1 f d d d d d d d d f 1 . . 
    . . 1 f f d d d d d d f f 1 . . 
    . . . 1 f 4 e e 4 4 e f 1 . . . 
    . 1 1 f b b b b b b b b f 1 1 . 
    1 1 f b b b b b b b b b b f 1 1 
    1 f c b b b b c c c b b b b f 1 
    1 f b b b b c c b c b b c c f 1 
    1 f b b b c b c b b b b b b f 1 
    1 f b b c c c c b c c b b b f 1 
    1 f b b c b b b c b b b b b f 1 
    1 f b b b b b b b b b b b b f 1 
    1 1 f b b b b b b b b b b f 1 1 
    . 1 1 f f f f f f f f f f 1 1 . 
    . . 1 1 1 1 1 1 1 1 1 1 1 1 . . 
    `
let trashCanImage = img`
    . . . . . . . . . . . . . . . . 
    . . . f f f f f f f f f . . . . 
    . . f e e e e e e e e e f . . . 
    . . f e 7 7 7 7 7 7 7 e f . . . 
    . . . f f f f f f f f f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e 7 7 7 7 7 e f . . . . 
    . . . f e e e e e e e f . . . . 
    . . . . f f f f f f f . . . . . 
    . . . . . . . . . . . . . . . . 
    `
let hazardImage = img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . 2 . . . 2 . . . . . . 
    . . . . 2 2 2 . 2 2 2 . . . . . 
    . . . 2 2 2 2 2 2 2 2 2 . . . . 
    . . 2 2 2 2 2 2 2 2 2 2 2 . . . 
    . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
    2 4 4 2 2 4 4 2 2 4 4 2 2 4 4 2 
    2 4 4 2 2 4 4 2 2 4 4 2 2 4 4 2 
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
    `
let movingPlatformImage = img`
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    `
// Create platforms from tilemap
for (let tileX2 = 0; tileX2 <= 31; tileX2++) {
    for (let tileY2 = 0; tileY2 <= 31; tileY2++) {
        location = tiles.getTileLocation(tileX2, tileY2)
        if (tiles.tileAtLocationEquals(location, assets.tile`myTile0`)) {
            tiles.setWallAt(location, true)
            platform = sprites.create(platformTile, SpriteKind.Food)
            tiles.placeOnTile(platform, location)
            platforms.push(platform)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`) || tiles.tileAtLocationEquals(location, sprites.castle.tileGrass3)) {
            tiles.setWallAt(location, true)
            platform2 = sprites.create(grassTile, SpriteKind.Food)
            tiles.placeOnTile(platform2, location)
            platforms.push(platform2)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`myTile3`)) {
            trashBag = sprites.create(trashBagImage, SpriteKind.TrashBag)
            tiles.placeOnTile(trashBag, location)
            tiles.setTileAt(location, assets.tile`myTile1`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`myTile2`)) {
            trashCan = sprites.create(trashCanImage, SpriteKind.TrashCan)
            tiles.placeOnTile(trashCan, location)
            tiles.setTileAt(location, assets.tile`myTile1`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`myTile5`)) {
            hazard = sprites.create(hazardImage, SpriteKind.Hazard)
            tiles.placeOnTile(hazard, location)
            tiles.setTileAt(location, assets.tile`myTile1`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`myTile4`)) {
            // Slow horizontal (vx = 30)
            createMovingPlatform(movingPlatformImage, location.x, location.y, 30, 0)
            tiles.setTileAt(location, assets.tile`myTile1`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`)) {
            // Medium horizontal (vx = 50)
            createMovingPlatform(movingPlatformImage, location.x, location.y, 50, 0)
            tiles.setTileAt(location, assets.tile`transparency16`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`)) {
            // Fast horizontal (vx = 70)
            createMovingPlatform(movingPlatformImage, location.x, location.y, 70, 0)
            tiles.setTileAt(location, assets.tile`transparency16`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`)) {
            // Very Fast horizontal (vx = 90)
            createMovingPlatform(movingPlatformImage, location.x, location.y, 90, 0)
            tiles.setTileAt(location, assets.tile`transparency16`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`)) {
            // Ultra Fast horizontal (vx = 110)
            createMovingPlatform(movingPlatformImage, location.x, location.y, 110, 0)
            tiles.setTileAt(location, assets.tile`transparency16`)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`)) {
            // Vertical (vy = 25)
            createMovingPlatform(movingPlatformImage, location.x, location.y, 0, 25)
            tiles.setTileAt(location, assets.tile`transparency16`)
        }
    }
}
// Place flag
let flag = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . 2 2 2 2 2 . . . . 
    . . . . . . . 2 5 5 5 2 2 . . . 
    . . . . . . . 2 5 5 5 5 2 2 . . 
    . . . . . . . 2 5 5 5 5 2 . . . 
    . . . . . . . 2 2 2 2 2 . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . e . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    `, SpriteKind.Flag)
flag.setPosition(480, 45)
// Start messages
game.splash("Clean Up the Park!")
game.splash("Trash bags = 5pts", "Trash cans = 25pts")
game.splash("Double jump with A!", "Get 50 points to win!")
// Platform collision
game.onUpdate(function () {
    playerOnGround = false
    if (mySprite.isHittingTile(CollisionDirection.Bottom)) {
        playerOnGround = true
    }
    for (let platform3 of platforms) {
        if (mySprite.vy >= 0) {
            if (mySprite.right > platform3.left + 3 && mySprite.left < platform3.right - 3) {
                if (mySprite.bottom >= platform3.top - 4 && mySprite.bottom <= platform3.top + 8) {
                    mySprite.bottom = platform3.top
                    mySprite.vy = 0
                    playerOnGround = true
                    if (platform3.kind() == SpriteKind.MovingPlatform) {
                        mySprite.x += platform3.vx * 0.02
                        mySprite.y += platform3.vy * 0.02
                    }
                    break;
                }
            }
        }
    }
    if (mySprite.y > scene.screenHeight() + 10) {
        info.changeLifeBy(-1)
        mySprite.setPosition(0, 100)
        mySprite.vy = 0
        mySprite.vx = 0
        scene.cameraFollowSprite(mySprite)
    }
})
// Moving platform behavior - using arrays to track starting positions
game.onUpdateInterval(100, function () {
    // Pixels to move from center
    movementRange = 80
    verticalRange = 50
    for (let i = 0; i <= movingPlatforms.length - 1; i++) {
        mp2 = movingPlatforms[i]
        // Horizontal movement
        if (mp2.vx != 0) {
            startX = platformStartX[i]
            if (mp2.x <= startX - movementRange || mp2.x >= startX + movementRange) {
                mp2.vx = mp2.vx * -1
            }
        }
        // Vertical movement
        if (mp2.vy != 0) {
            startY = platformStartY[i]
            if (mp2.y <= startY - verticalRange || mp2.y >= startY + verticalRange) {
                mp2.vy = mp2.vy * -1
            }
        }
    }
})
