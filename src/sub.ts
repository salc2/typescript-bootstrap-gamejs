export module Sub {
   export type Cancellable = () => void;
   export type Subscriber<A> = (a:A) => void;
   export type Observable<A> = (s:Subscriber<A>) => Cancellable;
   export type Subscription<A> = [string, Observable<A>];
  
   export function create<A>(id:string, obs:Observable<A>):Subscription<A> {
       return [id,obs];
   }

   export function run<A>(sub:Subscription<A>, sbr:Subscriber<A>): Cancellable{
       const [id, obs] = sub;
       return obs(sbr);
   }

}
