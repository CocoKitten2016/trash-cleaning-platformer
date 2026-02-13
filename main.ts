namespace SpriteKind {
    export const TrashBag = SpriteKind.create()
    export const TrashCan = SpriteKind.create()
    export const Flag = SpriteKind.create()
    export const MovingPlatform = SpriteKind.create()
    export const Hazard = SpriteKind.create()
}
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
// Collision handlers
sprites.onOverlap(SpriteKind.Player, SpriteKind.TrashBag, function (sprite, otherSprite) {
    otherSprite.destroy(effects.spray, 100)
    info.changeScoreBy(5)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.TrashCan, function (sprite, otherSprite) {
    if (info.score() >= 20) {
        otherSprite.destroy(effects.confetti, 100)
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
let jumpsLeft = 0
let playerOnGround = false
let hazard: Sprite = null
let trashBag: Sprite = null
let movingPlatforms: Sprite[] = []
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
// CRITICAL: Disable ALL tile collision
for (let tileX = 0; tileX <= 31; tileX++) {
    for (let tileY = 0; tileY <= 31; tileY++) {
        tiles.setWallAt(tiles.getTileLocation(tileX, tileY), false)
    }
}
// Platform images - upgraded
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
// Create platforms from tilemap
for (let tileX2 = 0; tileX2 <= 31; tileX2++) {
    for (let tileY2 = 0; tileY2 <= 31; tileY2++) {
        location = tiles.getTileLocation(tileX2, tileY2)
        if (tiles.tileAtLocationEquals(location, assets.tile`myTile0`)) {
            platform = sprites.create(platformTile, SpriteKind.Food)
            tiles.placeOnTile(platform, location)
            platforms.push(platform)
        } else if (tiles.tileAtLocationEquals(location, assets.tile`transparency16`) || tiles.tileAtLocationEquals(location, assets.tile`transparency16`) || tiles.tileAtLocationEquals(location, assets.tile`transparency16`) || tiles.tileAtLocationEquals(location, assets.tile`transparency16`) || tiles.tileAtLocationEquals(location, assets.tile`transparency16`) || tiles.tileAtLocationEquals(location, sprites.castle.tileGrass3)) {
            platform2 = sprites.create(grassTile, SpriteKind.Food)
            tiles.placeOnTile(platform2, location)
            platforms.push(platform2)
        }
    }
}
// Create moving platforms for longer level
let movingPlatform1 = sprites.create(img`
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    `, SpriteKind.MovingPlatform)
movingPlatform1.setPosition(100, 80)
movingPlatform1.vx = 30
platforms.push(movingPlatform1)
movingPlatforms.push(movingPlatform1)
let movingPlatform2 = sprites.create(img`
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    `, SpriteKind.MovingPlatform)
movingPlatform2.setPosition(250, 60)
movingPlatform2.vy = 25
platforms.push(movingPlatform2)
movingPlatforms.push(movingPlatform2)
let movingPlatform3 = sprites.create(img`
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 1 1 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 8 6 
    6 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 6 
    6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 
    `, SpriteKind.MovingPlatform)
movingPlatform3.setPosition(400, 70)
movingPlatform3.vx = -25
platforms.push(movingPlatform3)
movingPlatforms.push(movingPlatform3)
// Place trash bags strategically across longer level - upgraded sprites
for (let i = 0; i <= 3; i++) {
    trashBag = sprites.create(img`
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
        `, SpriteKind.TrashBag)
    trashBag.setPosition(20 + i * 32.2, 110)
}
for (let j = 0; j <= 4; j++) {
    trashBag = sprites.create(img`
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
        `, SpriteKind.TrashBag)
    trashBag.setPosition(180 + j * 45, 70)
}
for (let k = 0; k <= 5; k++) {
    trashBag = sprites.create(img`
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
        `, SpriteKind.TrashBag)
    trashBag.setPosition(360 + k * 35, 50)
}
// Place trash cans strategically - upgraded sprites
let trashCan = sprites.create(img`
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
    `, SpriteKind.TrashCan)
trashCan.setPosition(150, 118)
trashCan = sprites.create(img`
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
    `, SpriteKind.TrashCan)
trashCan.setPosition(320, 118)
trashCan = sprites.create(img`
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
    `, SpriteKind.TrashCan)
trashCan.setPosition(500, 118)
// Place flag at the end - upgraded sprite
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
// Add some hazards (spikes) - upgraded sprites
for (let l = 0; l <= 4; l++) {
    hazard = sprites.create(img`
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
        `, SpriteKind.Hazard)
    hazard.setPosition(200 + l * 50, 124)
}
// Start message
game.splash("Clean Up the Park!")
game.splash("Trash bags = 5pts", "Trash cans = 25pts")
game.splash("Double jump with A!", "Get 50 points to win!")
// Platform collision - FIXED so player doesn't fall through
game.onUpdate(function () {
    playerOnGround = false
    for (let platform3 of platforms) {
        // Better collision detection - only when falling down
        if (mySprite.vy >= 0) {
            // Check if player is within platform bounds horizontally
            if (mySprite.right > platform3.left + 3 && mySprite.left < platform3.right - 3) {
                // Check if player is near platform top
                if (mySprite.bottom >= platform3.top - 4 && mySprite.bottom <= platform3.top + 8) {
                    mySprite.bottom = platform3.top
                    mySprite.vy = 0
                    playerOnGround = true
                    // If on moving platform, move with it
                    if (platform3.kind() == SpriteKind.MovingPlatform) {
                        mySprite.x += platform3.vx * 0.02
                        mySprite.y += platform3.vy * 0.02
                    }
                    break;
                }
            }
        }
    }
    // Respawn if fall off screen
    if (mySprite.y > scene.screenHeight() + 10) {
        info.changeLifeBy(-1)
        mySprite.setPosition(0, 100)
        mySprite.vy = 0
        mySprite.vx = 0
        scene.cameraFollowSprite(mySprite)
    }
})
// Moving platform behavior
game.onUpdateInterval(100, function () {
    for (let mp2 of movingPlatforms) {
        if (mp2.vx != 0) {
            if (mp2.x <= 70 || mp2.x >= 150) {
                mp2.vx = mp2.vx * -1
            }
        }
        if (mp2.vy != 0) {
            if (mp2.y <= 40 || mp2.y >= 90) {
                mp2.vy = mp2.vy * -1
            }
        }
    }
})
