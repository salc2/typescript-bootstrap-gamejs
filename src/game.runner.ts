import {Cmd} from './cmd';
import {Sub} from './sub';

export type Up<A,M> = (a:A,m:M) => [M,Cmd<A>];
export type Ren<M> = (m:M) => void;

export function runGame<M,A>(update:Up<A,M>, render:Ren<M>, subs: (m:M) => Sub.Subscription<A>[], initState:[M,Cmd<A>]){
  let currentSubscribedTo: [string, Sub.Cancellable][] = [];
  let [m,c] = initState;
  let currentModel = m;

  function onEvent(event:A){
    const [nModel, ef] = update(event, currentModel);
    runEffect(ef);
    currentSubscribedTo = handleSubs(subs(nModel));
    render(nModel);
  };

  function runEffect(ef: Cmd<A>):void{
      const [e,a] = ef;
      e();
      onEvent(a);
  }
  function handleSubs(subs: Sub.Subscription<A>[]): [string, Sub.Cancellable][]{
      const newSubs:[string, Sub.Cancellable][] = [];
      const currents = currentSubscribedTo.map(s => s[0]);
      const [actives, discard] = partitionById(subs, currents);
      const [onlyNews, ..._] = partitionById(actives, currents);
      onlyNews.forEach(on => newSubs.push([on[0],on[1](onEvent)]) );
      currentSubscribedTo.filter( cls => {
        const [s,c] = cls;
        const predi = discard.indexOf(s) > -1;
        if(predi){
          c();
        }
        return !predi;
      });
      newSubs.concat(currentSubscribedTo);
      return newSubs;
  }

      function partitionById(subs:Sub.Subscription<A>[], subsC:string[]):[Sub.Subscription<A>[],string[]]{
      const act:Sub.Subscription<A>[] = [], dis:string[] = [];
      subs.forEach( sc => {
        if(subsC.indexOf(sc[0]) > -1){
          act.push(sc)
        }else{
          dis.push(sc[0])
        }
      });
      return [act,dis];
    }

}

 
