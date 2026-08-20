import { dbBaseRoot } from "../../assets/constantes";
export default async function getNormesLansas() {
                  try {
                      const response =await fetch(dbBaseRoot + "poudre/get-normesLansas", {
                      method: "GET",
                      headers: { 'Content-Type': 'application/json' }
                    });
                    const dt =await response.json();
                    const data = dt.data;
                    return data;
                }catch(error){
                    alert(error.message)
                }}