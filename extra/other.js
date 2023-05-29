function collision({objectRepresentator,objectCollisionBox})
{
    return(
        objectRepresentator.position.y + objectRepresentator.height >= objectCollisionBox.position.y && 
        objectRepresentator.position.y <= objectCollisionBox.position.y + objectCollisionBox.height && objectRepresentator.position.x <= objectCollisionBox.position.x + objectCollisionBox.width && objectRepresentator.position.x + objectRepresentator.width >= objectCollisionBox.position.x
    )
}

function platformCollision({objectRepresentator,objectCollisionBox})
{
    return(
        objectRepresentator.position.y + objectRepresentator.height >= objectCollisionBox.position.y && 
        objectRepresentator.position.y + objectRepresentator.height <= objectCollisionBox.position.y + objectCollisionBox.height && objectRepresentator.position.x <= objectCollisionBox.position.x + objectCollisionBox.width && objectRepresentator.position.x + objectRepresentator.width >= objectCollisionBox.position.x
    )
}