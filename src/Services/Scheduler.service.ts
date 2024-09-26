import { baseSchedulerApi } from "@/Constants/api";
import httpServices from "./http.services";

class schedulerServices {
    getSchedulerList() {
        return httpServices.get(baseSchedulerApi)
    }
}

const SchedulerServices = new schedulerServices();
export default SchedulerServices;