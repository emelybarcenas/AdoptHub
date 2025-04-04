
export default function Card({title, description}){
    return(
<div className="m-10 w-[20vw] h-[10vh] bg-amber-600 rounded-xl flex flex-col justify-center items-center gap-0">
  <h3 className="font-bold truncate ">{title}</h3>
  <p className="truncate ">{description}</p>
</div>

    )
}