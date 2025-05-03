from fastapi import APIRouter
from routes.auth import doctorRoute, patientRoute
from routes.images import router as imageRoute

router = APIRouter(
  prefix="/v1"
)

router.include_router(doctorRoute)
router.include_router(patientRoute)
router.include_router(imageRoute)