import {Sub} from './sub';


const clockSub = Sub.create('clock', (consumer: Sub.Subscriber<number>) => {
    let id = 0;
    let startTime = performance.now();
    const keepAnimation = (time:number) => {
      let t = time - startTime;
      consumer(t);
      startTime = time;
      id = requestAnimationFrame(keepAnimation);
    };
    id = requestAnimationFrame(keepAnimation);
    return () => cancelAnimationFrame(id);
  });


  Sub.run(clockSub, (msg) => console.log(msg));   
